<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<html>
			<body>
				<xsl:for-each select="root/stat">
					<xsl:if test="type='camembert'">
						<camembert style="float:left;height:350px;max-width:300px;margin:20px">
							<h3>
								<xsl:value-of select="nom"/>
							</h3>
				<!-- Stroke dasharay : {0 à 0} -> pour partir sur une brodure décalable,
				{0 à (942-taille} -> pour décaler  la portion
				{0 à 942} taille de la portion
				{942 à 942} taille du cercle en pixels	-->
				<svg width="300" height="300" style= "background-color: lightgray;border-radius: 50%;">

					<xsl:variable name="total"  select="total"/>
					<xsl:apply-templates select="./nombres/nombre[1]">
						
						<xsl:with-param name="decalage" select="0"/>
						<xsl:with-param name="total" select="$total"/>
					</xsl:apply-templates>
				</svg>
				<br/>

			</camembert>					
		</xsl:if>

	</xsl:for-each>
</body>
</html>
</xsl:template>

<xsl:template match="nombre">
	<xsl:param name="decalage" select="0"/>
	<xsl:param name="total" select="1"/>
	<xsl:variable name="nombre"  select="."/>
	<xsl:variable name="portion" select="$nombre div $total *942"/>
	<circle r="150" cx="150" cy="150" class="pie" fill-opacity="0" style='stroke:lightgreen;stroke-width: 300;
		stroke-dasharray: 0,{$decalage},{$portion+2},942;'>
	</circle>
	<xsl:apply-templates select="following-sibling::nombre[1]"> 
		<xsl:with-param name="decalage" select="$decalage + $portion"/>
		<xsl:with-param name="total" select="$total"/>
	</xsl:apply-templates> 



</xsl:template>

</xsl:stylesheet>