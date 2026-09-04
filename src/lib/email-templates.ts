/**
 * Templates de emails transaccionales.
 * Cada función devuelve { subject, html } para enviar via sendEmail().
 */

const COLORS = {
  agro: "#2E7D32",
  agroDark: "#1B5E20",
  sun: "#F9C513",
  cream: "#FAF7EF",
  stone: "#4E342E",
};

const baseStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: ${COLORS.cream}; padding: 0; margin: 0; color: ${COLORS.stone}; }
  .container { max-width: 560px; margin: 24px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
  .header { background: ${COLORS.agro}; color: white; padding: 24px 32px; text-align: center; }
  .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
  .header .sub { margin: 4px 0 0; font-size: 13px; opacity: 0.85; }
  .content { padding: 32px; }
  .content h2 { color: ${COLORS.agroDark}; margin-top: 0; }
  .button { display: inline-block; background: ${COLORS.sun}; color: #1a1a1a; padding: 12px 24px; border-radius: 10px; font-weight: 700; text-decoration: none; margin: 16px 0; }
  .footer { background: #f3efe3; padding: 16px 32px; text-align: center; font-size: 12px; color: #8d8475; }
`;

export function welcomeEmail(fullName: string) {
  return {
    subject: "¡Bienvenido a AgroConecta!",
    html: `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
      <div class="container">
        <div class="header"><h1>🌱 AgroConecta</h1><div class="sub">Tecnología que impulsa al agricultor</div></div>
        <div class="content">
          <h2>Hola, ${fullName}</h2>
          <p>Bienvenido a la comunidad que conecta el campo con el comprador, sin intermediarios.</p>
          <p>Si eres agricultor, completa tu verificación de identidad para aparecer como <strong>Agricultor Verificado</strong> y aumentar tu confianza.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verificar" class="button">Iniciar verificación</a>
        </div>
        <div class="footer">© ${new Date().getFullYear()} AgroConecta</div>
      </div>
    </body></html>`,
  };
}

export function verificationSubmittedEmail(fullName: string) {
  return {
    subject: "Recibimos tus documentos de verificación",
    html: `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
      <div class="container">
        <div class="header"><h1>📄 Documentos recibidos</h1></div>
        <div class="content">
          <h2>Hola, ${fullName}</h2>
          <p>Recibimos tu documentación. Nuestro equipo la revisará en menos de <strong>24 horas hábiles</strong>.</p>
          <p>Te avisaremos por email cuando tu cuenta sea aprobada o rechazada.</p>
        </div>
        <div class="footer">© ${new Date().getFullYear()} AgroConecta</div>
      </div>
    </body></html>`,
  };
}

export function verificationApprovedEmail(fullName: string) {
  return {
    subject: "✅ Tu cuenta de agricultor fue verificada",
    html: `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
      <div class="container">
        <div class="header"><h1>✅ Cuenta verificada</h1></div>
        <div class="content">
          <h2>¡Felicidades, ${fullName}!</h2>
          <p>Tu cuenta de agricultor fue <strong>verificada exitosamente</strong>.</p>
          <p>Ahora aparecerás con el sello de <strong>Agricultor Verificado</strong> en tu perfil y todas tus publicaciones. Los compradores podrán confiar en ti.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/publicar" class="button">Publicar mi primera cosecha</a>
        </div>
        <div class="footer">© ${new Date().getFullYear()} AgroConecta</div>
      </div>
    </body></html>`,
  };
}

export function verificationRejectedEmail(fullName: string, reason: string) {
  return {
    subject: "Tu solicitud de verificación fue rechazada",
    html: `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
      <div class="container">
        <div class="header"><h1>❌ Verificación rechazada</h1></div>
        <div class="content">
          <h2>Hola, ${fullName}</h2>
          <p>Lamentamos informarte que tu solicitud de verificación fue rechazada.</p>
          <p><strong>Motivo:</strong> ${reason}</p>
          <p>Puedes corregir los documentos y volver a intentarlo desde tu perfil.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verificar" class="button">Volver a intentar</a>
        </div>
        <div class="footer">© ${new Date().getFullYear()} AgroConecta</div>
      </div>
    </body></html>`,
  };
}

export function passwordResetEmail(link: string) {
  return {
    subject: "🔒 Restablece tu contraseña — AgroConecta",
    html: `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
      <div class="container">
        <div class="header"><h1>🔒 Restablece tu contraseña</h1></div>
        <div class="content">
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en AgroConecta.</p>
          <p>Haz click en el siguiente botón para crear una nueva contraseña. El enlace expira en <strong>1 hora</strong>.</p>
          <a href="${link}" class="button">Restablecer contraseña</a>
          <p style="margin-top: 20px; font-size: 13px; color: #8d8475;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
          <p style="font-size: 12px; color: #a89e8e;">Si el botón no funciona, copia y pega este enlace:<br><span style="word-break: break-all; font-family: monospace;">${link}</span></p>
        </div>
        <div class="footer">© ${new Date().getFullYear()} AgroConecta</div>
      </div>
    </body></html>`,
  };
}