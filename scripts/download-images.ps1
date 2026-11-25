$ErrorActionPreference = "SilentlyContinue"
$dest = "C:\Users\tanim\OneDrive\Documents\Default Project\public\images"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

# Curated, stable Unsplash photograph IDs. Images are saved locally so the
# shipped site has zero external image dependencies and no broken links.
$images = [ordered]@{
  "hero-men"        = "photo-1516257984-b1b4d707412e"
  "hero-women"      = "photo-1539109136881-3be0616acf4b"
  "editorial"       = "photo-1483985988355-763728e1935b"
  "story"           = "photo-1441986300917-64674bd600d8"
  "cat-men"         = "photo-1487222477894-8943e31ef7b2"
  "cat-women"       = "photo-1496747611176-843222e1e57c"
  "cat-tshirts"     = "photo-1521572163474-6864f9cf17ab"
  "cat-shirts"      = "photo-1598033129183-c4f50c736f10"
  "cat-jeans"       = "photo-1541099649105-f69ad21f3246"
  "cat-hoodies"     = "photo-1556821840-3a63f95609a7"
  "cat-accessories" = "photo-1601924994987-69e26d50dc26"
  "p-tshirt-1"      = "photo-1503341504253-dff4815485f1"
  "p-tshirt-2"      = "photo-1596755094514-f87e34085b2c"
  "p-tshirt-3"      = "photo-1620799140408-edc6dcb6d633"
  "p-tshirt-4"      = "photo-1576566588028-4147f3842f27"
  "p-shirt-1"       = "photo-1602810318383-e386cc2a3ccf"
  "p-shirt-2"       = "photo-1594633312681-425c7b97ccd1"
  "p-shirt-3"       = "photo-1603252109303-2751441dd157"
  "p-shirt-4"       = "photo-1589310243389-96a5483213a8"
  "p-jeans-1"       = "photo-1542272604-787c3835535d"
  "p-jeans-2"       = "photo-1475178626620-a4d074967452"
  "p-jeans-3"       = "photo-1584370848010-d7fe6bc767ec"
  "p-jeans-4"       = "photo-1598554747436-c9293d6a588f"
  "p-hoodie-1"      = "photo-1578681994506-b8f463449011"
  "p-hoodie-2"      = "photo-1556906781-9a412961c28c"
  "p-hoodie-3"      = "photo-1620799140188-3b2a02fd9a77"
  "p-hoodie-4"      = "photo-1512436991641-6745cdb1723f"
  "p-acc-1"         = "photo-1523275335684-37898b6baf30"
  "p-acc-2"         = "photo-1547949003-9792a18a2601"
  "p-acc-3"         = "photo-1584917865442-de89df76afd3"
  "p-acc-4"         = "photo-1600185365926-3a2ce3cdb9eb"
  "p-dress-1"       = "photo-1595777457583-95e059d581b8"
  "p-dress-2"       = "photo-1515372039744-b8f02a3ae446"
  "p-kurti-1"       = "photo-1583496661160-fb5886a13d68"
  "p-blazer-1"      = "photo-1591047139829-d91aecb6caea"
  "lifestyle-1"     = "photo-1490481651871-ab68de25d43d"
  "lifestyle-2"     = "photo-1503342217505-b0a15ec3261c"
  "lifestyle-3"     = "photo-1469334031218-e382a71b716b"
}

$ok = 0; $fail = 0
foreach ($key in $images.Keys) {
  $id = $images[$key]
  $url = "https://images.unsplash.com/$($id)?w=1000&q=80&fit=crop"
  $out = Join-Path $dest "$($key).jpg"
  try {
    Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing -TimeoutSec 45
    if ((Get-Item $out).Length -gt 5000) { $ok++ } else { Write-Output "SMALL: $key"; $fail++ }
  } catch {
    Write-Output "FAIL: $key -> $($_.Exception.Message)"; $fail++
  }
}
Write-Output "DONE ok=$ok fail=$fail"
