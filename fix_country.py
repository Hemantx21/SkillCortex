import pathlib

countries = [
("+93","Afghanistan"),("+355","Albania"),("+213","Algeria"),("+376","Andorra"),("+244","Angola"),("+1-268","Antigua and Barbuda"),("+54","Argentina"),("+374","Armenia"),("+61","Australia"),("+43","Austria"),("+994","Azerbaijan"),("+1-242","Bahamas"),("+973","Bahrain"),("+880","Bangladesh"),("+1-246","Barbados"),("+375","Belarus"),("+32","Belgium"),("+501","Belize"),("+229","Benin"),("+975","Bhutan"),("+591","Bolivia"),("+387","Bosnia and Herzegovina"),("+267","Botswana"),("+55","Brazil"),("+673","Brunei"),("+359","Bulgaria"),("+226","Burkina Faso"),("+257","Burundi"),("+855","Cambodia"),("+237","Cameroon"),("+1","Canada"),("+238","Cape Verde"),("+236","Central African Republic"),("+235","Chad"),("+56","Chile"),("+86","China"),("+57","Colombia"),("+269","Comoros"),("+242","Congo"),("+243","Congo (DRC)"),("+506","Costa Rica"),("+385","Croatia"),("+53","Cuba"),("+357","Cyprus"),("+420","Czech Republic"),("+45","Denmark"),("+253","Djibouti"),("+1-767","Dominica"),("+1-809","Dominican Republic"),("+593","Ecuador"),("+20","Egypt"),("+503","El Salvador"),("+240","Equatorial Guinea"),("+291","Eritrea"),("+372","Estonia"),("+251","Ethiopia"),("+679","Fiji"),("+358","Finland"),("+33","France"),("+241","Gabon"),("+220","Gambia"),("+995","Georgia"),("+49","Germany"),("+233","Ghana"),("+30","Greece"),("+1-473","Grenada"),("+502","Guatemala"),("+224","Guinea"),("+245","Guinea-Bissau"),("+592","Guyana"),("+509","Haiti"),("+504","Honduras"),("+36","Hungary"),("+354","Iceland"),("+91","India"),("+62","Indonesia"),("+98","Iran"),("+964","Iraq"),("+353","Ireland"),("+972","Israel"),("+39","Italy"),("+225","Ivory Coast"),("+1-876","Jamaica"),("+81","Japan"),("+962","Jordan"),("+254","Kenya"),("+686","Kiribati"),("+383","Kosovo"),("+965","Kuwait"),("+996","Kyrgyzstan"),("+856","Laos"),("+371","Latvia"),("+961","Lebanon"),("+266","Lesotho"),("+231","Liberia"),("+218","Libya"),("+423","Liechtenstein"),("+370","Lithuania"),("+352","Luxembourg"),("+261","Madagascar"),("+265","Malawi"),("+60","Malaysia"),("+960","Maldives"),("+223","Mali"),("+356","Malta"),("+692","Marshall Islands"),("+222","Mauritania"),("+230","Mauritius"),("+52","Mexico"),("+691","Micronesia"),("+373","Moldova"),("+377","Monaco"),("+976","Mongolia"),("+382","Montenegro"),("+212","Morocco"),("+258","Mozambique"),("+95","Myanmar"),("+264","Namibia"),("+674","Nauru"),("+977","Nepal"),("+31","Netherlands"),("+64","New Zealand"),("+505","Nicaragua"),("+227","Niger"),("+234","Nigeria"),("+850","North Korea"),("+389","North Macedonia"),("+47","Norway"),("+968","Oman"),("+92","Pakistan"),("+680","Palau"),("+970","Palestine"),("+507","Panama"),("+675","Papua New Guinea"),("+595","Paraguay"),("+51","Peru"),("+63","Philippines"),("+48","Poland"),("+351","Portugal"),("+974","Qatar"),("+40","Romania"),("+7","Russia"),("+250","Rwanda"),("+1-869","Saint Kitts and Nevis"),("+1-758","Saint Lucia"),("+1-784","Saint Vincent and the Grenadines"),("+685","Samoa"),("+378","San Marino"),("+239","Sao Tome and Principe"),("+966","Saudi Arabia"),("+221","Senegal"),("+381","Serbia"),("+248","Seychelles"),("+232","Sierra Leone"),("+65","Singapore"),("+421","Slovakia"),("+386","Slovenia"),("+677","Solomon Islands"),("+252","Somalia"),("+27","South Africa"),("+82","South Korea"),("+211","South Sudan"),("+34","Spain"),("+94","Sri Lanka"),("+249","Sudan"),("+597","Suriname"),("+268","Swaziland"),("+46","Sweden"),("+41","Switzerland"),("+963","Syria"),("+886","Taiwan"),("+992","Tajikistan"),("+255","Tanzania"),("+66","Thailand"),("+670","Timor-Leste"),("+228","Togo"),("+676","Tonga"),("+1-868","Trinidad and Tobago"),("+216","Tunisia"),("+90","Turkey"),("+993","Turkmenistan"),("+688","Tuvalu"),("+256","Uganda"),("+380","Ukraine"),("+971","United Arab Emirates"),("+44","United Kingdom"),("+1","United States"),("+598","Uruguay"),("+998","Uzbekistan"),("+678","Vanuatu"),("+39-06","Vatican City"),("+58","Venezuela"),("+84","Vietnam"),("+967","Yemen"),("+260","Zambia"),("+263","Zimbabwe"),
]

p = pathlib.Path(r'c:/Users/LENOVO/OneDrive/Desktop/project Work/SkillCortex/client/src/components/ui/auth-section-3.tsx')
s = p.read_text()

arr = "const COUNTRY_CODES = [\n" + "".join(f'  {{ code: "{c}", name: "{n}" }},\n' for c,n in countries) + "];\n\n"
marker = 'import { motion } from "framer-motion";\n'
assert marker in s
s = s.replace(marker, marker + "\n" + arr, 1)

old_select = '''                <select name="countryCode" className="w-full rounded-lg border border-black/15 bg-white px-3.5 py-2 text-sm text-black dark:border-white/10 dark:bg-white/5 dark:text-white">
                  <option value="+1">+1 (US/CA)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+91">+91 (IN)</option>
                  <option value="+61">+61 (AU)</option>
                  <option value="+81">+81 (JP)</option>
                </select>'''
new_select = '''                <select name="countryCode" className="w-full rounded-lg border border-black/15 bg-white px-3.5 py-2 text-sm text-black dark:border-white/10 dark:bg-white/5 dark:text-white">
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code + c.name} value={c.code}>{c.code} {c.name}</option>
                  ))}
                </select>'''
assert old_select in s, "select block not found"
s = s.replace(old_select, new_select)

p.write_text(s)
print("done")
