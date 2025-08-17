// netlify/functions/monday-webhook.js - VERSIÓN CORREGIDA
const https = require('https');

exports.handler = async (event, context) => {
    // Headers CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Manejar preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: headers,
            body: ''
        };
    }

    // Solo POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        console.log('=== INICIO DEBUG ===');
        const { action, data } = JSON.parse(event.body);
        
        if (action !== 'create_item') {
            throw new Error('Invalid action');
        }

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

        // 🔧 FORMATO CORREGIDO PARA LAS COLUMNAS
        // Extraer datos del formulario enviado desde el frontend
        const formData = data.columnValues ? JSON.parse(data.columnValues) : {};
        
        // Crear objeto con formato correcto para Monday.com
        const correctColumnValues = {};
        
        // Nombre del Invitado (texto simple)
        if (formData.text_mkttwsxe) {
            correctColumnValues.text_mkttwsxe = formData.text_mkttwsxe;
        }
        
        // 📧 Email (formato específico para columna email)
        if (formData.email_mkttdysy) {
            correctColumnValues.email_mkttdysy = {
                email: formData.email_mkttdysy,
                text: formData.email_mkttdysy
            };
        }
        
        // 📱 Teléfono (formato específico para columna phone)
        if (formData.phone_mktt53e7) {
            correctColumnValues.phone_mktt53e7 = {
                phone: formData.phone_mktt53e7,
                countryShortName: "MX"  // México como default
            };
        }
        
        // Empresa (texto simple)
        if (formData.text_mkttf67d) {
            correctColumnValues.text_mkttf67d = formData.text_mkttf67d;
        }
        
        // 🏷️ Estado (formato específico para columna status)
        correctColumnValues.color_mkttd2ew = {
            label: "Registrado"
        };
        
        // Solicitudes Especiales (texto largo)
        if (formData.long_text_mkttfbxz) {
            correctColumnValues.long_text_mkttfbxz = formData.long_text_mkttfbxz;
        }
        
        // Mensaje de Confirmación (texto largo)
        if (formData.long_text_mkttkqhg) {
            correctColumnValues.long_text_mkttkqhg = formData.long_text_mkttkqhg;
        }

        console.log('Column values formatted:', JSON.stringify(correctColumnValues, null, 2));

        const variables = {
            boardId: data.boardId,
            itemName: data.itemName,
            columnValues: JSON.stringify(correctColumnValues)
        };

        const response = await makeGraphQLRequest(mutation, variables, MONDAY_API_TOKEN);
        console.log('Success response:', JSON.stringify(response, null, 2));
        
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({
                success: true,
                data: response.data
            })
        };

    } catch (error) {
        console.error('=== ERROR ===');
        console.error('Error completo:', error);
        
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({
                success: false,
                error: error.message || 'Internal server error'
            })
        };
    }
};

function makeGraphQLRequest(query, variables, token) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            query: query,
            variables: variables
        });

        console.log('GraphQL Request to Monday:', postData);

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
                console.log('Monday response status:', res.statusCode);
                console.log('Monday response data:', data);
                
                try {
                    const jsonResponse = JSON.parse(data);
                    
                    if (jsonResponse.errors) {
                        reject(new Error(`Monday API Error: ${JSON.stringify(jsonResponse.errors)}`));
                    } else {
                        resolve(jsonResponse);
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${e.message}. Raw data: ${data}`));
                }
            });
        });

        req.on('error', (e) => {
            console.error('Request error:', e);
            reject(new Error(`Request failed: ${e.message}`));
        });

        req.write(postData);
        req.end();
    });
}