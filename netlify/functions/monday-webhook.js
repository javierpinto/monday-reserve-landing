// netlify/functions/monday-webhook.js
// Función serverless para Netlify que maneja el registro de invitados

const https = require('https');

exports.handler = async (event, context) => {
    // Solo permitir POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Manejar preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    try {
        const { action, data } = JSON.parse(event.body);
        
        if (action !== 'create_item') {
            throw new Error('Invalid action');
        }

        // Token de API de Monday.com (debe estar en variables de entorno)
        const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN;
        
        if (!MONDAY_API_TOKEN) {
            throw new Error('Monday API token not configured');
        }

        const mutation = `
            mutation CreateItem($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
                create_item(board_id: $boardId, item_name: $itemName, column_values: $columnValues) {
                    id
                    name
                    column_values {
                        id
                        text
                    }
                }
            }
        `;

        const response = await makeGraphQLRequest(mutation, data, MONDAY_API_TOKEN);
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                data: response.data
            })
        };

    } catch (error) {
        console.error('Error:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: false,
                error: error.message || 'Internal server error'
            })
        };
    }
};

// Función para hacer requests a la API de Monday.com
function makeGraphQLRequest(query, variables, token) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            query: query,
            variables: variables
        });

        const options = {
            hostname: 'api.monday.com',
            port: 443,
            path: '/v2',
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'API-Version': '2024-10'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonResponse = JSON.parse(data);
                    
                    if (jsonResponse.errors) {
                        reject(new Error(`Monday API Error: ${JSON.stringify(jsonResponse.errors)}`));
                    } else {
                        resolve(jsonResponse);
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${e.message}`));
                }
            });
        });

        req.on('error', (e) => {
            reject(new Error(`Request failed: ${e.message}`));
        });

        req.write(postData);
        req.end();
    });
}

// package.json para las dependencias (crear en la raíz del proyecto)
/*
{
    "name": "monday-reserve-landing",
    "version": "1.0.0",
    "description": "Landing page para evento Monday Reserve",
    "scripts": {
        "build": "echo 'Build complete'",
        "dev": "netlify dev"
    },
    "dependencies": {},
    "devDependencies": {
        "netlify-cli": "^17.0.0"
    }
}
*/

// netlify.toml - Configuración para Netlify (crear en la raíz del proyecto)
/*
[build]
  functions = "netlify/functions"
  publish = "."

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Headers = "Content-Type"
    Access-Control-Allow-Methods = "GET, POST, OPTIONS"
*/