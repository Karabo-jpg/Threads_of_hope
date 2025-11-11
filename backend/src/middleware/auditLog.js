const { AuditLog } = require('../models');

// Middleware to log all requests
const auditLogger = async (req, res, next) => {
  const startTime = Date.now();

  // Store original res.json for interception
  const originalJson = res.json.bind(res);

  res.json = function (data) {
    const duration = Date.now() - startTime;

    // Create audit log asynchronously (don't block response)
    setImmediate(async () => {
      try {
        const logData = {
          userId: req.user?.id || null,
          action: req.method,
          entityType: extractEntityType(req.path),
          entityId: extractEntityId(req.path, req.body, req.params),
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('user-agent'),
          requestMethod: req.method,
          requestUrl: req.originalUrl,
          statusCode: res.statusCode,
          duration,
        };

        // Add old/new values for modifications
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
          if (req.method === 'POST') {
            logData.newValues = sanitizeData(req.body);
          } else if (req.method === 'PUT' || req.method === 'PATCH') {
            logData.newValues = sanitizeData(req.body);
            // Old values would be fetched before update in controller
          }
        }

        await AuditLog.create(logData);
      } catch (error) {
        console.error('Audit log error:', error);
      }
    });

    return originalJson(data);
  };

  next();
};

// Extract entity type from request path
const extractEntityType = (path) => {
  const parts = path.split('/').filter(Boolean);
  if (parts.length >= 2) {
    const entity = parts[1];
    return entity.charAt(0).toUpperCase() + entity.slice(1).replace(/-/g, '');
  }
  return 'Unknown';
};

// Extract entity ID from request
const extractEntityId = (path, body, params) => {
  if (params.id) return params.id;
  if (body.id) return body.id;
  
  const idMatch = path.match(/\/([a-f0-9-]{36})\/?/i);
  if (idMatch) return idMatch[1];
  
  return null;
};

// Sanitize data to remove sensitive information
const sanitizeData = (data) => {
  if (!data) return null;
  
  const sanitized = { ...data };
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard'];
  
  Object.keys(sanitized).forEach(key => {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

module.exports = { auditLogger };


