import { NextResponse } from "next/server";

const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Pandblink API",
    description:
      "AI-powered photo enhancement for real estate. Automatically improves lighting, colors, and sharpness of property photos.",
    version: "1.0.0",
    contact: {
      name: "Pandblink",
      url: "https://pandblink.nl",
      email: "info@pandblink.nl",
    },
  },
  servers: [
    {
      url: "https://pandblink.nl",
      description: "Production server",
    },
  ],
  paths: {
    "/": {
      get: {
        summary: "Home page",
        description:
          "Main application page where users can upload and enhance photos",
        operationId: "getHomePage",
        responses: {
          "200": {
            description: "HTML page with photo upload interface",
          },
        },
      },
    },
    "/api/enhance": {
      post: {
        summary: "Enhance a property photo",
        description:
          "Upload a property photo and receive an AI-enhanced version with improved lighting, colors, and sharpness. Requires authentication and available credits.",
        operationId: "enhancePhoto",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  image: {
                    type: "string",
                    format: "binary",
                    description: "The property photo to enhance (JPEG, PNG, or WebP, max 10MB)",
                  },
                },
                required: ["image"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Enhanced photo URL and remaining credits",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    enhancedImageUrl: { type: "string", description: "URL of the enhanced photo" },
                    message: { type: "string" },
                    remainingCredits: { type: "integer" },
                  },
                },
              },
            },
          },
          "401": { description: "Authentication required" },
          "402": { description: "Insufficient credits" },
          "429": { description: "Rate limit exceeded" },
        },
      },
    },
    "/api/history": {
      get: {
        summary: "Get enhancement history",
        description: "Retrieve paginated list of previously enhanced photos for the authenticated user",
        operationId: "getHistory",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 12 } },
        ],
        responses: {
          "200": {
            description: "List of enhanced photos with pagination",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    history: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          createdAt: { type: "string", format: "date-time" },
                          enhancedImageUrl: { type: "string" },
                          originalFileName: { type: "string" },
                        },
                      },
                    },
                    pagination: {
                      type: "object",
                      properties: {
                        page: { type: "integer" },
                        limit: { type: "integer" },
                        totalCount: { type: "integer" },
                        totalPages: { type: "integer" },
                        hasMore: { type: "boolean" },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": { description: "Authentication required" },
        },
      },
    },
    "/api/stripe/checkout": {
      post: {
        summary: "Create checkout session",
        description: "Create a Stripe checkout session to purchase credits",
        operationId: "createCheckout",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  packageId: { type: "string", description: "Credit package ID (starter, popular, pro)" },
                },
                required: ["packageId"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Checkout URL",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    url: { type: "string", description: "Stripe checkout URL" },
                  },
                },
              },
            },
          },
          "401": { description: "Authentication required" },
          "429": { description: "Rate limit exceeded" },
        },
      },
    },
    "/credits": {
      get: {
        summary: "Purchase credits",
        description: "Page to purchase credits for photo enhancements",
        operationId: "getCreditsPage",
        responses: {
          "200": { description: "HTML page with credit packages" },
        },
      },
    },
    "/history": {
      get: {
        summary: "Photo history",
        description: "Page showing all previously enhanced photos",
        operationId: "getHistoryPage",
        responses: {
          "200": { description: "HTML page with photo gallery" },
        },
      },
    },
    "/faq": {
      get: {
        summary: "FAQ page",
        description: "Frequently asked questions about Pandblink",
        operationId: "getFAQPage",
        responses: {
          "200": { description: "HTML page with FAQ content" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        description: "JWT token from authentication",
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(openApiSpec, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
