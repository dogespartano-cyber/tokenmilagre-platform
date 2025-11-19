/**
 * Resources API Route
 *
 * Handles resource listing (GET) and creation (POST) with:
 * - Service layer integration (ResourceService)
 * - Zod validation for all inputs
 * - Structured logging with context
 * - Standardized response format
 * - Auth helpers for role-based access
 */

import { NextRequest } from 'next/server'
import { ServiceLocator } from '@/lib/di/container'
import { successResponse, errorResponse } from '@/lib/helpers/response-helpers'
import { requireEditor } from '@/lib/helpers/auth-helpers'
import { resourceCreateSchema, resourceQuerySchema } from '@/lib/schemas/resource-schemas'

/**
 * GET /api/resources - List resources with filters
 *
 * Public endpoint (no authentication required)
 *
 * Query params:
 * - category: Filter by category (wallets, exchanges, browsers, defi, explorers, tools)
 * - verified: Filter by verification status (true/false/all, default: true)
 */
export async function GET(request: NextRequest) {
  const logger = ServiceLocator.getLogger()
  logger.setContext({ endpoint: '/api/resources', method: 'GET' })

  try {
    const validation = ServiceLocator.getValidation()
    const resourceService = ServiceLocator.getResource()

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams
    const rawQuery = {
      category: searchParams.get('category'),
      verified: searchParams.get('verified'),
    }

    const query = validation.validate(resourceQuerySchema, rawQuery)

    logger.info('Listing resources', {
      category: query.category,
      verified: query.verified
    })

    // Fetch resources using service layer
    const result = await resourceService.list(query)

    logger.info('Resources listed successfully', {
      count: result.resources.length,
      total: result.total,
      page: result.page
    })

    return successResponse({
      data: result.resources,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
        count: result.resources.length
      }
    })
  } catch (error) {
    logger.error('Error listing resources', error as Error)
    return errorResponse(error as Error)
  } finally {
    logger.clearContext()
  }
}

/**
 * POST /api/resources - Create new resource
 *
 * Requires: ADMIN or EDITOR role
 *
 * Body params:
 * - name: Resource name (required)
 * - slug: URL-friendly slug (required)
 * - category: Category (required)
 * - shortDescription: Brief description (required)
 * - officialUrl: Official website URL (required)
 * - platforms: Array of platforms (Web, iOS, Android, Desktop)
 * - tags: Array of tags
 * - heroTitle: Hero section title
 * - heroDescription: Hero section description
 * - heroGradient: CSS gradient for hero section
 * - whyGoodTitle: "Why it's good" section title
 * - whyGoodContent: Array of paragraphs explaining benefits
 * - features: Array of feature objects with icon, title, description
 * - howToStartTitle: "How to start" section title
 * - howToStartSteps: Array of step objects with number, title, description
 * - pros: Array of pros
 * - cons: Array of cons
 * - faq: Array of FAQ objects with question and answer
 * - securityTips: Array of security tip objects with icon, title, description
 * - showCompatibleWallets: Boolean to show compatible wallets section
 * - relatedResources: Array of related resource slugs
 */
export async function POST(request: NextRequest) {
  const auth = await requireEditor(request)
  if (!auth.success) return auth.response

  const logger = ServiceLocator.getLogger()
  logger.setContext({ endpoint: '/api/resources', method: 'POST', userId: auth.user.id })

  try {
    const validation = ServiceLocator.getValidation()
    const resourceService = ServiceLocator.getResource()

    // Parse and validate request body
    const body = await request.json()

    logger.info('Creating resource', { slug: body.slug, category: body.category })

    // Validate using Zod schema
    const validated = validation.validate(resourceCreateSchema, body)

    // Create resource using service layer
    // Service handles JSON stringification and default values
    const resource = await resourceService.create(validated, auth.user.id)

    logger.info('Resource created successfully', {
      resourceId: resource.id,
      slug: resource.slug,
      name: resource.name
    })

    return successResponse({
      id: resource.id,
      slug: resource.slug,
      name: resource.name,
      message: 'Recurso criado com sucesso!'
    })
  } catch (error) {
    logger.error('Error creating resource', error as Error)
    return errorResponse(error as Error)
  } finally {
    logger.clearContext()
  }
}
