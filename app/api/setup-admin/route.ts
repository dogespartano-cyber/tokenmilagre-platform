
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/core/prisma';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
        }

        const email = user.emailAddresses[0]?.emailAddress;
        console.log('setup-admin: Attempting to promote', email, userId);

        // 1. Ensure user exists in DB
        let dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });

        // Auto-link if verified by email but missing clerkId (Just in case logic didn't run)
        if (!dbUser && email) {
            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing) {
                dbUser = await prisma.user.update({
                    where: { id: existing.id },
                    data: { clerkId: userId }
                });
            }
        }

        if (!dbUser) {
            // Create if doesn't exist? Ideally we should have it.
            return NextResponse.json({ error: 'User not found in DB. Please access the App first to trigger creation.' }, { status: 404 });
        }

        // 2. Promote to ADMIN
        const updated = await prisma.user.update({
            where: { id: dbUser.id },
            data: { role: 'ADMIN' }
        });

        // 3. 🚀 MIGRATION: Transfer articles from legacy admin to this user
        // Only if this user is dogespartano@proton.me (safety check) or just do it for any Admin claiming it?
        // Let's do it for any authenticated user running this setup, assuming they are the owner recovering access.

        let transferredCount = 0;
        const legacyAdminEmail = 'admin@tokenmilagre.xyz';
        const legacyAdmin = await prisma.user.findUnique({ where: { email: legacyAdminEmail } });

        if (legacyAdmin && legacyAdmin.id !== dbUser.id) {
            console.log(`Found legacy admin (${legacyAdmin.id}) with potential articles...`);

            // Update all articles
            const updateResult = await prisma.article.updateMany({
                where: { authorId: legacyAdmin.id },
                data: { authorId: dbUser.id }
            });

            transferredCount = updateResult.count;
            console.log(`✅ Transferred ${transferredCount} articles from ${legacyAdminEmail} to ${email}`);
        }

        return NextResponse.json({
            success: true,
            message: `User ${updated.email} is now an ADMIN.`,
            role: updated.role,
            migration: transferredCount > 0 ? `Recovered ${transferredCount} articles from old Admin account.` : 'No legacy articles to recover.'
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
