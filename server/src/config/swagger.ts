import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Personal Finance Tracker API',
            version: '1.0.0',
            description:
                'RESTful API for Personal Finance Budget Tracking Application. Manage income, expenses, budgets, and categories.',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token',
                },
            },
            schemas: {
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: { type: 'object', nullable: true },
                        timestamp: { type: 'string', format: 'date-time' },
                    },
                },
                ApiError: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: { type: 'string' },
                                    message: { type: 'string' },
                                },
                            },
                            nullable: true,
                        },
                        timestamp: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
        tags: [
            { name: 'Auth', description: 'Authentication & user management' },
            { name: 'Categories', description: 'Category management' },
            { name: 'Transactions', description: 'Income & expense transactions' },
            { name: 'Budgets', description: 'Budget management & tracking' },
        ],
    },
    apis: ['./src/modules/**/*.routes.ts', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
