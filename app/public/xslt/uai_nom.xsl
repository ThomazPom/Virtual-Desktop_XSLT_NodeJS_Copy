<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
  <html>
  <body>
  <h2>Liste des établissements</h2>
    <table class="table">
      <tr bgcolor="#9acd32">
        <th style="text-align:left">UAI</th>
        <th style="text-align:left">Nom</th>
      </tr>
      <xsl:for-each select="root/etablissements/etablissement">
      <tr>
        <td><xsl:value-of select="UAI"/></td>
        <td><xsl:value-of select="nom"/></td>
      </tr>
      </xsl:for-each>
    </table>
  </body>
  </html>
</xsl:template>
</xsl:stylesheet>

