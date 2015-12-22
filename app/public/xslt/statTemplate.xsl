<xsl:stylesheet version="1.0"  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"  >
	<xsl:template match="/">
		<html>
			<body>
				<xsl:for-each select="root/stat">

					<xsl:if test="type='camembert'">
						<camembert style="float:left;height:350px;max-width:300px;margin:20px">
							<h3>
								<xsl:value-of select="nom"/>
							</h3>

							<svg id="svg" style="padding:10px;height:100%">
								<defs></defs>
								<circle cx="150" cy="150" r="150" fill="#bada55" stroke="#000000" style="stroke-width: 0px;"><xsl:value-of select="total"/></circle>

								<xsl:for-each select="./nombres/nombre">
									<path fill="orange" stroke="#446688" stroke-width="0"  ><xsl:value-of select="."/></path>
									<text x="408.3005093668" y="296.5435769061">  14%</text>
								</xsl:for-each>
							</svg>
							<br/>
							<h2></h2>

						</camembert>
					</xsl:if>

				</xsl:for-each>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>