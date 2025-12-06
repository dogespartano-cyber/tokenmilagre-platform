
import { prisma } from '../lib/prisma';

async function verifyAndPromote() {
    const email = 'zenfoco@proton.me';

    console.log(`🔍 Checking user: ${email}...`);

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.log('❌ User not found in database! Please log in at least once.');
            return;
        }

        console.log(`✅ User found: ${user.name} (${user.id})`);
        console.log(`Current Role: ${user.role}`);

        if (user.role === 'ADMIN') {
            console.log('✨ User is already an ADMIN.');
        } else {
            console.log('🚀 Promoting to ADMIN...');
            await prisma.user.update({
                where: { email },
                data: { role: 'ADMIN' }
            });
            console.log('✅ Success! User is now an ADMIN.');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

verifyAndPromote();
