<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt"
  xmlns:user="urn:my-scripts">



 <xsl:template match="data">  

  <html>
    <body>

      <div id="msxmlbody"></div>
      <circles>

        <xsl:for-each select="circle">
          <circle>
            <xsl:copy-of select="node()"/>
            <circumference>
            </circumference>
          </circle>
        </xsl:for-each>
      </circles>
    </body></html>
  </xsl:template>

</xsl:stylesheet>