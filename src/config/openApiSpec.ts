import {
  DESTINATION_OPTIONS,
  DESTINATION_OPTION_LABELS,
  ORIGIN_OPTIONS,
  ORIGIN_OPTION_LABELS
} from '../constants/locationOptions';

const originDescription = `Allowed origin options in India: ${Object.entries(ORIGIN_OPTION_LABELS)
  .map(([code, city]) => `${code} (${city})`)
  .join(', ')}`;

const destinationDescription = `Allowed destination options in India: ${Object.entries(
  DESTINATION_OPTION_LABELS
)
  .map(([code, city]) => `${code} (${city})`)
  .join(', ')}`;

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Ride Sharing System API',
    version: '1.0.0',
    description: 'Minimal ride-sharing backend API for testing workflows'
  },
  servers: [{ url: '/' }],
  tags: [
    { name: 'Health' },
    { name: 'Drivers' },
    { name: 'Riders' },
    { name: 'Trips' }
  ],
  components: {
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      },
      DriverPayload: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Driver 1' }
        }
      },
      RiderPayload: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Rider 1' }
        }
      },
      AvailabilityPayload: {
        type: 'object',
        required: ['available'],
        properties: {
          available: { type: 'boolean', example: true }
        }
      },
      TripPayload: {
        type: 'object',
        required: ['riderId', 'origin', 'destination', 'seats'],
        properties: {
          riderId: { type: 'integer', example: 1 },
          origin: {
            type: 'integer',
            enum: ORIGIN_OPTIONS,
            example: ORIGIN_OPTIONS[0],
            description: originDescription
          },
          destination: {
            type: 'integer',
            enum: DESTINATION_OPTIONS,
            example: DESTINATION_OPTIONS[0],
            description: destinationDescription
          },
          seats: { type: 'integer', example: 1 }
        }
      },
      UpdateTripPayload: {
        type: 'object',
        required: ['origin', 'destination', 'seats'],
        properties: {
          origin: {
            type: 'integer',
            enum: ORIGIN_OPTIONS,
            example: ORIGIN_OPTIONS[1],
            description: originDescription
          },
          destination: {
            type: 'integer',
            enum: DESTINATION_OPTIONS,
            example: DESTINATION_OPTIONS[1],
            description: destinationDescription
          },
          seats: { type: 'integer', example: 2 }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { status: { type: 'string', example: 'ok' } }
                }
              }
            }
          }
        }
      }
    },
    '/drivers': {
      post: {
        tags: ['Drivers'],
        summary: 'Register a driver',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DriverPayload' }
            }
          }
        },
        responses: {
          '201': { description: 'Driver created' },
          '400': {
            description: 'Validation or business error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/drivers/{id}/availability': {
      patch: {
        tags: ['Drivers'],
        summary: 'Update driver availability',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AvailabilityPayload' }
            }
          }
        },
        responses: {
          '200': { description: 'Availability updated' },
          '400': {
            description: 'Validation or business error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/drivers/available': {
      get: {
        tags: ['Drivers'],
        summary: 'Get count of available drivers',
        responses: {
          '200': {
            description: 'Available drivers count',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { count: { type: 'integer', example: 3 } }
                }
              }
            }
          }
        }
      }
    },
    '/riders': {
      post: {
        tags: ['Riders'],
        summary: 'Register a rider',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RiderPayload' }
            }
          }
        },
        responses: {
          '201': { description: 'Rider created' }
        }
      }
    },
    '/riders/{id}': {
      get: {
        tags: ['Riders'],
        summary: 'Get rider by id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': {
            description: 'Rider details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'Rider 1' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation or business error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/trips': {
      post: {
        tags: ['Trips'],
        summary: 'Create trip',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TripPayload' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Trip created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { tripId: { type: 'string' } }
                }
              }
            }
          },
          '400': {
            description: 'Validation or business error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/trips/{tripId}': {
      patch: {
        tags: ['Trips'],
        summary: 'Update trip',
        parameters: [{ name: 'tripId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateTripPayload' }
            }
          }
        },
        responses: {
          '200': { description: 'Trip updated' },
          '400': {
            description: 'Validation or business error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/trips/{tripId}/withdraw': {
      post: {
        tags: ['Trips'],
        summary: 'Withdraw trip',
        parameters: [{ name: 'tripId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Trip withdrawn' },
          '400': {
            description: 'Validation or business error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/drivers/{driverId}/end-trip': {
      post: {
        tags: ['Trips'],
        summary: 'End active trip for driver',
        parameters: [
          { name: 'driverId', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Trip fare',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { fare: { type: 'number', example: 200 } }
                }
              }
            }
          },
          '400': {
            description: 'Validation or business error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/riders/{riderId}/trips': {
      get: {
        tags: ['Trips'],
        summary: 'Get rider trip count',
        parameters: [
          { name: 'riderId', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Trip history count',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { count: { type: 'integer', example: 5 } }
                }
              }
            }
          }
        }
      }
    }
  }
} as const;
