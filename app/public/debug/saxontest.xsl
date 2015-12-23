<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0" xmlns:saxon="http://saxon.sf.net/" extension-element-prefixes="saxon">
	<xsl:variable name="i" saxon:assignable="yes" 
    xmlns:saxon="http://saxon.sf.net/">0</xsl:variable>
	<xsl:template match="/">
		<html>
			<body>
				<!-- <saxon:while test="$i &lt; 10"> -->
					<div> The value of i is <xsl:value-of select="$i"/></div>
					<saxon:assign name="i" select="$i+1"/>
				<!-- </saxon:while> -->
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>