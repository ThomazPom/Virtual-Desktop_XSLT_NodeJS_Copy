<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:colors="colors:colors" xmlns:fo="http://www.w3.org/1999/XSL/Format">
	<xsl:output encoding="UTF-8" indent="yes" method="xml" standalone="no" omit-xml-declaration="no"/>
	
	<xsl:variable name="colorCount" select="count(document('')/*/colors:colors/color)"/>
	
	<xsl:template match="/">
		<fo:root language="FR">
			<fo:layout-master-set>
				<fo:simple-page-master master-name="A4-portrail" page-height="297mm" page-width="210mm" margin-top="5mm" margin-bottom="5mm" margin-left="5mm" margin-right="5mm">
					<fo:region-body margin-top="25mm" margin-bottom="20mm"/>
					<fo:region-before region-name="xsl-region-before" extent="25mm" display-align="before" precedence="true"/>
				</fo:simple-page-master>
			</fo:layout-master-set>

			<fo:page-sequence master-reference="A4-portrail">
				<fo:static-content flow-name="xsl-region-before">
					<fo:table table-layout="fixed" width="100%" font-size="10pt" border-color="black" border-width="0.4mm" border-style="solid">
						<fo:table-column column-width="proportional-column-width(80)"/>
						<fo:table-column column-width="proportional-column-width(20)"/>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell text-align="center" display-align="center">
									<fo:block font-size="20pt" color="crimson">
										Statistiques sur la base de données
									</fo:block>
									<fo:block space-before="3mm"/>
								</fo:table-cell>
								<fo:table-cell text-align="right" display-align="center" padding-right="2mm">
									<fo:block>
										<xsl:value-of select="testata/data"/>
									</fo:block>
									<fo:block display-align="before" space-before="6mm">Page <fo:page-number/>
								</fo:block>
							</fo:table-cell>
						</fo:table-row>
					</fo:table-body>
				</fo:table>
			</fo:static-content>
			<fo:flow flow-name="xsl-region-body" border-collapse="collapse" reference-orientation="0">
				<xsl:for-each select="root/stat">
					<fo:block font-size="20pt"><xsl:value-of select="nom" /></fo:block>
					<xsl:variable name="total"  select="total"/>
					<xsl:variable name="count"  select="count(./nombres/nombre)"/>
					<xsl:if test="type='camembert'">
						<fo:block>
							<fo:instream-foreign-object>
								<svg width="100mm" height="100mm" version="1.1" xmlns="http://www.w3.org/2000/svg">
									<text x="125" y="125" fill="blue" style="font-size: 20px;">Total:</text>
									<text x="105" y="170" fill="blue" style="font-size: 40px;"><xsl:value-of select="$total" /></text>
									<xsl:call-template name="camRecCaller">
										<xsl:with-param name="count" select="$count"/>
										<xsl:with-param name="callPos" select="1"/>
										<xsl:with-param name="parent" select="./nombres"/>
										<xsl:with-param name="total" select="$total"/>
										<xsl:with-param name="decalage" select="0"/>
									</xsl:call-template>
								</svg>
							</fo:instream-foreign-object>
						</fo:block>					
					</xsl:if>
					<xsl:if test="type='histogramme'">
						<fo:block>	
							<fo:instream-foreign-object>
								<svg width="190mm" height="100mm" version="1.1" xmlns="http://www.w3.org/2000/svg">
									<xsl:call-template name="histoRecCaller">
										<xsl:with-param name="count" select="$count"/>
										<xsl:with-param name="callPos" select="0"/>
										<xsl:with-param name="parent" select="./nombres"/>
										<xsl:with-param name="total" select="$total"/>
									</xsl:call-template>
									<line x1="0" y1="50" x2="450" y2="50" style="stroke:red" />
									<!-- <text x="15" y="15" fill="crimson" style="font-size: 20px;">Total:</text> -->
									<text x="15" y="50" fill="crimson" style="font-size: 40px;"><xsl:value-of select="$total" /></text>
								</svg>
							</fo:instream-foreign-object>
						</fo:block>
					</xsl:if>
					<fo:table table-layout="fixed" width="100%" font-size="10pt" border-color="black" border-width="0.35mm" border-style="solid" text-align="center" display-align="center" space-after="5mm" break-after="page">
						<fo:table-column column-width="proportional-column-width(7)"/>
						<fo:table-column column-width="proportional-column-width(73)"/>
						<fo:table-column column-width="proportional-column-width(10)"/>
						<fo:table-column column-width="proportional-column-width(10)"/>
						<fo:table-body font-size="95%">
							<fo:table-row height="8mm">
								<fo:table-cell>
									<fo:block></fo:block>
								</fo:table-cell>
								<fo:table-cell>
									<fo:block>Nom</fo:block>
								</fo:table-cell>
								<fo:table-cell>
									<fo:block>Portion</fo:block>
								</fo:table-cell>
								<fo:table-cell>
									<fo:block>Pourcentage</fo:block>
								</fo:table-cell>
							</fo:table-row>
							<xsl:call-template name="bodyTabCaller">
								<xsl:with-param name="count" select="$count"/>
								<xsl:with-param name="callPos" select="0"/>
								<xsl:with-param name="parent" select="./nombres"/>
								<xsl:with-param name="total" select="$total"/>
							</xsl:call-template>
						</fo:table-body>
					</fo:table>
				</xsl:for-each>
			</fo:flow>
		</fo:page-sequence>
	</fo:root>
</xsl:template>
<xsl:template name="bodyTabCaller">
	<xsl:param name="count" select="0"/>
	<xsl:param name="callPos" select="0"/>
	<xsl:param name="parent"/>
	<xsl:param name="total" select="1"/>
	<xsl:call-template name="bodyTab">
		<xsl:with-param name="node" select="$parent/nombre[$callPos+1]"/>
		<xsl:with-param name="total" select="$total"/>
		<xsl:with-param name="position" select="$callPos"/>
		<xsl:with-param name="maxpos" select="$callPos+499"/>
	</xsl:call-template>
	<xsl:if test="$callPos+500 &lt; $count">
		<xsl:call-template name="bodyTabCaller">
			<xsl:with-param name="callPos" select="$callPos+500"/>
			<xsl:with-param name="parent" select="$parent"/>
			<xsl:with-param name="total" select="$total"/>
			<xsl:with-param name="count" select="$count"/>
		</xsl:call-template>
	</xsl:if>
</xsl:template>
<xsl:template name="histoRecCaller">
	<xsl:param name="callPos" select="0"/>
	<xsl:param name="parent"/>
	<xsl:param name="total" select="1"/>
	<xsl:param name="count" select="0"/>
	<xsl:call-template name="histoRec">
		<xsl:with-param name="node" select="$parent/nombre[$count - $callPos]"/>
		<xsl:with-param name="decalage" select="$count"/>
		<xsl:with-param name="total" select="$total"/>
		<xsl:with-param name="position" select="$callPos+1"/>
		<xsl:with-param name="maxpos" select="$callPos+499"/>
	</xsl:call-template>
	<xsl:if test="$callPos+500 &lt; $count">
		<xsl:call-template name="histoRecCaller">
			<xsl:with-param name="callPos" select="$callPos + 500"/>
			<xsl:with-param name="parent" select="$parent"/>
			<xsl:with-param name="total" select="$total"/>
			<xsl:with-param name="count" select="$count"/>
		</xsl:call-template>
	</xsl:if>
</xsl:template>
<xsl:template name="camRecCaller">
	<xsl:param name="count"/>
	<xsl:param name="callPos"/>
	<xsl:param name="parent"/>
	<xsl:param name="total"/>
	<xsl:param name="decalage"/>
	<xsl:call-template name="camRec">
		<xsl:with-param name="node" select="$parent/nombre[$callPos]"/>
		<xsl:with-param name="decalage" select="$decalage"/>
		<xsl:with-param name="total" select="$total"/>
		<xsl:with-param name="position" select="$callPos"/>
		<xsl:with-param name="maxpos" select="$callPos+499"/>
	</xsl:call-template>
	<xsl:if test="$callPos+500 &lt; $count">
		<xsl:variable name="totaldecal" select="sum($parent/nombre[$callPos+500]/preceding-sibling::nombre)"/>
		<xsl:call-template name="camRecCaller">
			<xsl:with-param name="callPos" select="$callPos + 500"/>
			<xsl:with-param name="parent" select="$parent"/>
			<xsl:with-param name="total" select="$total"/>
			<xsl:with-param name="count" select="$count"/>
			<xsl:with-param name="decalage" select="$totaldecal div $total *625"/>
		</xsl:call-template>
	</xsl:if>
</xsl:template>
<xsl:template name="camRec"  xmlns="http://www.w3.org/2000/svg"  >
	<xsl:param name="node"/>
	<xsl:param name="decalage"/>
	<xsl:param name="total"/>
	<xsl:param name="position"/>
	<xsl:param name="maxpos"/>
	<!-- Stroke dasharay : {0 à 0} -> pour partir sur une brodure décalable, -->
	<!-- {0 à (625-taille)} -> pour décaler  la portion -->
	<!-- {0 à 625} taille de la portion -->
	<!-- {625 à 625} taille du cercle en pixels				 -->
	<xsl:variable name="portion" select="$node div $total *625"/>
	<xsl:if test="$node/following-sibling::nombre and $position &lt; $maxpos">
		<xsl:call-template name="camRec">
			<xsl:with-param name="node" select="$node/following-sibling::nombre[1]"/>
			<xsl:with-param name="decalage" select="($portion + $decalage)"/>
			<xsl:with-param name="total" select="$total"/>
			<xsl:with-param name="position" select="$position +1"/>
			<xsl:with-param name="maxpos" select="$maxpos"/>
		</xsl:call-template>
	</xsl:if>
	<xsl:variable name="couleur" select="document('')/*/colors:colors/color[$position mod $colorCount + 1]"/>
	<circle r="100" cx="150" cy="150"  fill-opacity="0" style='stroke:{$couleur};stroke-width: 50;
		stroke-dasharray: 0,{$decalage},{$portion+3},940;'>
	</circle>
</xsl:template>
<xsl:template name="histoRec"   xmlns="http://www.w3.org/2000/svg">
	<xsl:param name="node" select="0"/>
	<xsl:param name="decalage" select="0"/>
	<xsl:param name="total" select="1"/>
	<xsl:param name="position" select="1"/>
	<xsl:param name="maxpos" select="0"/>
	<xsl:if test="$node/preceding-sibling::nombre and $position &lt; $maxpos">
		<xsl:call-template name="histoRec">
			<xsl:with-param name="node" select="$node/preceding-sibling::nombre[1]"/>
			<xsl:with-param name="decalage" select="$decalage"/>
			<xsl:with-param name="total" select="$total"/>
			<xsl:with-param name="position" select="$position +1"/>
			<xsl:with-param name="maxpos" select="$maxpos"/>
		</xsl:call-template>
	</xsl:if>
	<xsl:variable name="portion" select="$node*200 div $total"/>
	<xsl:variable name="couleur" select="document('')/*/colors:colors/color[($decalage - $position+1) mod $colorCount + 1]"/>
	<xsl:variable name="width" select="350 div $decalage"/>
	<xsl:variable name="x" select="substring(350-($position*350 div $decalage),0,8)"/>
	<xsl:variable name="y" select="250-$portion"/>
	<xsl:variable name="p1" select="$x+$width"/>
	<xsl:variable name="p2" select="($y)-($width*0.2)"/>
	<xsl:variable name="p3" select="$x+$width*1.5"/>
	<xsl:variable name="p4" select="$y+$portion"/>
	<polygon points="{$x+$width*0.5} {$p2},{$p3} {$p2},{$p1} {$y},{$x} {$y},{$x} {$p4},{$p1} {$p4},{$p1} {$y},{$p3} {$p2},{$p3} {$p4 -$width*0.2},{$p1} {$p4},{$p1} {$y},{$x} {$y}
		" style="fill:{$couleur};stroke:black;
		stroke-width:3px;
		stroke-opacity:0.2;" /> 
	</xsl:template>
	<xsl:template name="bodyTab"  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
		<xsl:param name="node"/>
		<xsl:param name="total"/>
		<xsl:param name="position"/>
		<xsl:param name="maxpos"/>
		<xsl:variable name="pourcentage" select="$node div $total*100"/>
		<xsl:variable name="couleur" select="document('')/*/colors:colors/color[($position+ 1) mod $colorCount + 1]"/>
		<fo:table-row>
			<fo:table-cell><fo:block  background-color="{$couleur}">&#160;</fo:block></fo:table-cell>
			<fo:table-cell><fo:block><xsl:if test="$node/@name=''">(Aucun)</xsl:if><xsl:value-of select="$node/@name"/></fo:block></fo:table-cell>
			<fo:table-cell><fo:block><xsl:value-of select="$node"/></fo:block></fo:table-cell>
			<fo:table-cell><fo:block><xsl:value-of select="substring($pourcentage,0,5)"/>%</fo:block></fo:table-cell>
		</fo:table-row>
		<xsl:if test="$node/following-sibling::nombre and $position &lt; $maxpos">
			<xsl:call-template name="bodyTab">
				<xsl:with-param name="node" select="$node/following-sibling::nombre[1]"/>
				<xsl:with-param name="total" select="$total"/>
				<xsl:with-param name="position" select="$position +1"/>
				<xsl:with-param name="maxpos" select="$maxpos"/>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>
	<xsl:template match="nombre" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/2000/svg" >
		<xsl:param name="decalage" select="0"/>
		<xsl:param name="total" select="1"/>
		<xsl:param name="position" select="1"/>
		<xsl:variable name="nombre"  select="."/>
		<xsl:variable name="portion" select="$nombre div $total *942"/>
		<xsl:variable name="couleur" select="document('')/*/colors:colors[$position mod $colorCount + 1]"/>
		<circle r="150" cx="150" cy="150"  fill-opacity="0" style='stroke:{$couleur};stroke-width: 200;
			stroke-dasharray: 0,{$decalage},{$portion+3},942;'>
		</circle>
		<xsl:apply-templates select="following-sibling::nombre[1]"> 
			<xsl:with-param name="decalage" select="$decalage + $portion"/>
			<xsl:with-param name="total" select="$total"/>
			<xsl:with-param name="position" select="$position +1"/>
		</xsl:apply-templates> 
	</xsl:template>
	<colors:colors>
		<color>wheat</color>
		<color>royalblue</color>
		<color>lime</color>
		<color>red</color>
		<color>aquamarine</color>
		<color>bisque</color>
		<color>blue</color>
		<color>brown</color>
		<color>burlywood</color>
		<color>cadetblue</color>
		<color>chartreuse</color>
		<color>chocolate</color>
		<color>coral</color>
		<color>cornflowerblue</color>
		<color>crimson</color>
		<color>cyan</color>
		<color>darkcyan</color>
		<color>black</color>
		<color>darkgoldenrod</color>
		<color>darkgray</color>
		<color>darkgreen</color>
		<color>darkkhaki</color>
		<color>darkolivegreen</color>
		<color>darkorchid</color>
		<color>darkred</color>
		<color>darksalmon</color>
		<color>darkseagreen</color>
		<color>darkslategray</color>
		<color>deeppink</color>
		<color>deepskyblue</color>
		<color>dimgray</color>
		<color>dodgerblue</color>
		<color>firebrick</color>
		<color>forestgreen</color>
		<color>fuchsia</color>
		<color>gold</color>
		<color>goldenrod</color>
		<color>green</color>
		<color>greenyellow</color>
		<color>hotpink</color>
		<color>indianred</color>
		<color>indigo</color>
		<color>lightblue</color>
		<color>lightcoral</color>
		<color>lightgreen</color>
		<color>lightgrey</color>
		<color>lightpink</color>
		<color>lightsalmon</color>
		<color>lightseagreen</color>
		<color>lightskyblue</color>
		<color>lightsteelblue</color>
		<color>lime</color>
		<color>magenta</color>
		<color>maroon</color>
		<color>mediumseagreen</color>
		<color>mediumslateblue</color>
		<color>mediumspringgreen</color>
		<color>midnightblue</color>
		<color>navy</color>
		<color>olive</color>
		<color>olivedrab</color>
		<color>orange</color>
		<color>orangered</color>
		<color>paleturquoise</color>
		<color>palevioletred</color>
		<color>papayawhip</color>
		<color>peachpuff</color>
		<color>peru</color>
		<color>pink</color>
		<color>plum</color>
		<color>powderblue</color>
		<color>rosybrown</color>
		<color>saddlebrown</color>
		<color>salmon</color>
		<color>sandybrown</color>
		<color>seagreen</color>
		<color>sienna</color>
		<color>silver</color>
		<color>skyblue</color>
		<color>slateblue</color>
		<color>slategray</color>
		<color>springgreen</color>
		<color>steelblue</color>
		<color>tan</color>
		<color>teal</color>
		<color>thistle</color>
		<color>tomato</color>
		<color>turquoise</color>
		<color>violet</color>
		<color>yellow</color>
		<color>yellowgreen</color>
	</colors:colors>
</xsl:stylesheet>