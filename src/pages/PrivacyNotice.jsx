// src/pages/PrivacyNotice.jsx
import './PrivacyNotice.css';

export default function PrivacyNotice() {
  return (
    <div className="privacy-notice">
      <h1>Privacy & Cookie Policy</h1>
      <p className="updated">Senast uppdaterad: 5 november 2025</p>

      <section>
        <p>
          Miniforum använder cookies för att webbplatsen ska fungera och för att förbättra din upplevelse.
          Denna policy förklarar vilka cookies vi använder och varför.
        </p>
      </section>

      <section>
        <h2>1. Vad är cookies?</h2>
        <p>
          Cookies är små textfiler som lagras på din enhet när du besöker en webbplats.
          De hjälper webbplatsen att komma ihåg dina val och förbättra din upplevelse.
        </p>
      </section>

      <section>
        <h2>2. Vilka cookies använder Miniforum?</h2>

        <div className="cookie-section necessary">
          <h3>Nödvändiga Cookies</h3>
          <p className="cookie-badge">Kan ej avaktiveras</p>
          <p><strong>Cookie:</strong> accessToken</p>
          <ul>
            <li><strong>Syfte:</strong> Håller dig inloggad på Miniforum</li>
            <li><strong>Varaktighet:</strong> 1 timme</li>
            <li><strong>Rättslig grund:</strong> Berättigat intresse</li>
          </ul>
          <p><strong>Säkerhet:</strong></p>
          <ul>
            <li>httpOnly - Kan inte läsas av JavaScript (skydd mot XSS-attacker)</li>
            <li>secure - Skickas endast över HTTPS i produktion</li>
            <li>sameSite: Strict - Skydd mot CSRF-attacker</li>
          </ul>
          <p className="note">Denna cookie är nödvändig för att webbplatsen ska fungera och kan inte stängas av.</p>
        </div>

        <div className="cookie-section marketing">
          <h3>Marketing Cookies</h3>
          <p className="cookie-badge">Valfritt - Kräver samtycke</p>
          <ul>
            <li><strong>Syfte:</strong> Personaliserad reklam, nyhetsbrev och specialerbjudanden</li>
            <li><strong>Rättslig grund:</strong> Ditt samtycke</li>
            <li><strong>Kontroll:</strong> Du kan när som helst ändra ditt samtycke via dina <a href="/settings">inställningar</a></li>
          </ul>
        </div>

        <div className="cookie-section analytics">
          <h3>Analytics Cookies</h3>
          <p className="cookie-badge">Valfritt - Kräver samtycke</p>
          <ul>
            <li><strong>Syfte:</strong> Anonymiserad statistik för att förbättra Miniforum</li>
            <li><strong>Rättslig grund:</strong> Ditt samtycke</li>
            <li><strong>Kontroll:</strong> Du kan när som helst ändra ditt samtycke via dina <a href="/settings">inställningar</a></li>
          </ul>
        </div>
      </section>

      <section>
        <h2>3. Samtyckes-loggar</h2>
        <p>
          För att kunna bevisa att du gav samtycke loggar vi följande information:
        </p>
        <ul>
          <li>Tidpunkt för samtycke</li>
          <li>IP-adress (för säkerhet och att upptäcka obehörig åtkomst)</li>
          <li>Webbläsare (User-Agent)</li>
          <li>Typ av samtycke (marketing/analytics)</li>
          <li>Åtgärd (beviljat/återkallat)</li>
        </ul>
        <p className="note">
          Du kan när som helst se alla dina samtyckes-loggar via dina <a href="/settings">inställningar</a>.
        </p>
      </section>

      <section>
        <h2>4. Var lagras din data?</h2>
        <p><strong>Databas:</strong> MongoDB Atlas</p>
        <ul>
          <li>Region: EU</li>
          <li>Kryptering: Data krypteras både vid lagring och överföring</li>
          <li>Backup: Automatisk, krypterad backup</li>
        </ul>
      </section>

      <section>
        <h2>5. Hur länge sparar vi cookies?</h2>
        <ul>
          <li><strong>Nödvändiga cookies (accessToken):</strong> 1 timme, raderas när du loggar ut</li>
          <li><strong>Samtycken:</strong> Sparas tills du ändrar dem eller raderar ditt konto</li>
          <li><strong>Samtyckes-loggar:</strong> Bevaras för att kunna bevisa samtycke</li>
        </ul>
      </section>

      <section>
        <h2>6. Dina rättigheter</h2>

        <div className="rights-section">
          <h3>Rätt till åtkomst</h3>
          <p>Se all din användardata, samtycken och loggar via <a href="/settings">Mina Inställningar</a></p>
        </div>

        <div className="rights-section">
          <h3>Rätt till dataportabilitet</h3>
          <p>Exportera all din data i JSON-format via <a href="/settings">Mina Inställningar</a> → "Exportera Data"</p>
        </div>

        <div className="rights-section">
          <h3>Rätt att dra tillbaka samtycke</h3>
          <p>
            Ändra marketing/analytics-samtycken när som helst via <a href="/settings">Mina Inställningar</a> → "Cookie Inställningar"
          </p>
          <p className="note">Du kan fortfarande använda Miniforum även om du återkallar samtycke</p>
        </div>

        <div className="rights-section">
          <h3>Rätt till radering</h3>
          <p>
            Radera ditt konto permanent via <a href="/settings">Mina Inställningar</a> → "Radera Konto"
          </p>
          <p className="warning">OBS: Denna åtgärd är permanent och kan inte ångras</p>
        </div>
      </section>

      <section>
        <h2>7. Hantera dina cookie-inställningar</h2>
        <ol>
          <li>Logga in på Miniforum</li>
          <li>Gå till <a href="/settings">Mina Inställningar</a></li>
          <li>Klicka på "Cookie Inställningar"</li>
          <li>Aktivera/avaktivera Marketing och Analytics cookies</li>
          <li>Klicka "Spara inställningar"</li>
        </ol>
        <p>Dina ändringar träder i kraft omedelbart och loggas automatiskt.</p>
      </section>

      <section>
        <h2>8. Tredjepartstjänster</h2>
        <p><strong>MongoDB Atlas (Databas):</strong></p>
        <ul>
          <li>Syfte: Lagra användardata, samtycken och inlägg</li>
          <li>Region: EU</li>
          <li>Data Processing Agreement: Ja, MongoDB är GDPR-compliant</li>
          <li>Data överföring: Nej, all data stannar inom EU</li>
        </ul>
        <p className="note">
          Vi informerar dig om alla tredjepartstjänster som behandlar din data.
        </p>
      </section>

      <section>
        <h2>9. Dataintrång</h2>
        <p>Om ett dataintrång skulle inträffa:</p>
        <ul>
          <li><strong>Inom 72 timmar:</strong> Vi rapporterar till Datainspektionen</li>
          <li><strong>Omedelbart:</strong> Du informeras om intrånget påverkar dina rättigheter</li>
          <li><strong>Transparens:</strong> Vi informerar dig om typ av intrång, påverkad data och vidtagna åtgärder</li>
        </ul>
      </section>

      <section>
        <h2>10. Kontakta oss</h2>
        <p>För frågor om cookies eller din integritet:</p>
        <ul>
          <li><strong>Email:</strong> privacy@miniforum.se</li>
          <li><strong>Svarstid:</strong> Inom 30 dagar</li>
        </ul>
        <p><strong>Self-service verktyg:</strong></p>
        <ul>
          <li>Samtycken: <a href="/settings">Mina Inställningar</a> → Cookie Inställningar</li>
          <li>Exportera data: <a href="/settings">Mina Inställningar</a> → Exportera Data</li>
          <li>Radera konto: <a href="/settings">Mina Inställningar</a> → Radera Konto</li>
        </ul>
      </section>

      <section>
        <h2>11. Ändringar i denna policy</h2>
        <p>Vi kan uppdatera denna Cookie Policy när:</p>
        <ul>
          <li>Regelverket ändras</li>
          <li>Vi lägger till nya funktioner</li>
          <li>Vi börjar använda nya tredjepartstjänster</li>
        </ul>
        <p>Du informeras om ändringar via email och meddelande när du loggar in.</p>
      </section>

      <footer className="privacy-footer">
        <p>© 2025 Miniforum. Alla rättigheter förbehållna.</p>
      </footer>
    </div>
  );
}