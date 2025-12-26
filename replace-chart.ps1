$file = "d:\Ai Meeting Assistant\Astrogoly Website\src\pages\Kundli.jsx"
$content = Get-Content $file -Raw

# Find the start and end of the SVG section
$startPattern = '<h3 className="kp-section-title">Bhav Chalit Chart</h3>'
$endPattern = '</svg>\s*</div>\s*\s*{/\* Ruling Planets'

# Replacement
$replacement = @'
<h3 className="kp-section-title">Bhav Chalit Chart</h3>
                                        <div className="bhav-chalit-chart">
                                            <NorthIndianChart bhavChalit={chartData.kp.bhavChalit} />
                                        </div>

                                        {/* Ruling Planets
'@

# Do the replacement
$newContent = $content -replace "(?s)$startPattern.*?$endPattern", $replacement

# Save
Set-Content $file -Value $newContent -NoNewline

Write-Host "Chart component replaced successfully!"
