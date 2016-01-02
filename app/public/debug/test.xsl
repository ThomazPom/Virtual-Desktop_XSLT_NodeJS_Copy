<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:template match="/">
    <html> 
      <body>  <xsl:variable name="vTwice">
        <xsl:call-template name="twice">
          <xsl:with-param name="pN" select="5"/>
        </xsl:call-template>
        
      </xsl:variable>

      <xsl:call-template name="loop">
        <xsl:with-param name="pTtimes" select="3"/>
        <xsl:with-param name="pN" select="$vTwice"/>
      </xsl:call-template>
    </body>
  </html>
</xsl:template>

<xsl:template name="loop">
  <xsl:param name="pTtimes" select="1"/>
  <xsl:param name="pN" select="2"/>

  <xsl:choose>
    <xsl:when test="not($pTtimes > 0)">
     <xsl:value-of select="$pN"/>
   </xsl:when>
   <xsl:otherwise>
     <xsl:call-template name="loop">
      <xsl:with-param name="pTtimes" select="$pTtimes -1"/>
      <xsl:with-param name="pN" select="2*$pN"/>
    </xsl:call-template>
  </xsl:otherwise>
</xsl:choose>
</xsl:template>

<xsl:template name="twice">
  <xsl:param name="pN" select="1"/>

  <xsl:value-of select="2*$pN"/>
</xsl:template>
</xsl:stylesheet>