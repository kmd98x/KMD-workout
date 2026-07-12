/**
 * Schematic front/back body silhouettes, ported verbatim from the prototype.
 * Each muscle shape carries its muscle-id(s) as a space-separated `class`
 * attribute (e.g. `class="m chest"`), and has no fill set here — the
 * `<g class="sil">` silhouette and the `.m` muscle shapes are unstyled by
 * design; the BodyMap component (features/exercises/components/BodyMap.tsx)
 * is responsible for coloring the silhouette and setting each `.m` shape's
 * fill at render time (heatmap intensity or primary/secondary role),
 * mirroring the prototype's runtime `style.fill` assignment.
 */
export const SVG_FRONT =
  '<svg viewBox="0 0 100 178" xmlns="http://www.w3.org/2000/svg">' +
  '<g class="sil">' +
  '<circle cx="50" cy="13" r="8.5"/><rect x="34" y="24" width="32" height="46" rx="8"/>' +
  '<rect x="19" y="28" width="9" height="26" rx="4.5"/><rect x="72" y="28" width="9" height="26" rx="4.5"/>' +
  '<rect x="16" y="52" width="8" height="24" rx="4"/><rect x="76" y="52" width="8" height="24" rx="4"/>' +
  '<rect x="36" y="66" width="28" height="14" rx="5"/>' +
  '<rect x="35" y="78" width="12" height="44" rx="6"/><rect x="53" y="78" width="12" height="44" rx="6"/>' +
  '<rect x="37" y="122" width="9" height="42" rx="4.5"/><rect x="54" y="122" width="9" height="42" rx="4.5"/></g>' +
  '<ellipse class="m chest" cx="42" cy="40" rx="7" ry="6"/><ellipse class="m chest" cx="58" cy="40" rx="7" ry="6"/>' +
  '<circle class="m shoulders_front shoulders_side" cx="24" cy="33" r="6"/><circle class="m shoulders_front shoulders_side" cx="76" cy="33" r="6"/>' +
  '<ellipse class="m traps" cx="44" cy="27" rx="4" ry="3"/><ellipse class="m traps" cx="56" cy="27" rx="4" ry="3"/>' +
  '<ellipse class="m biceps" cx="22" cy="46" rx="4" ry="8"/><ellipse class="m biceps" cx="78" cy="46" rx="4" ry="8"/>' +
  '<ellipse class="m forearms" cx="19" cy="66" rx="3.6" ry="10"/><ellipse class="m forearms" cx="81" cy="66" rx="3.6" ry="10"/>' +
  '<rect class="m abs" x="44" y="49" width="12" height="20" rx="3"/>' +
  '<ellipse class="m obliques" cx="40" cy="57" rx="2.6" ry="8"/><ellipse class="m obliques" cx="60" cy="57" rx="2.6" ry="8"/>' +
  '<ellipse class="m quadriceps hip_flexors adductors" cx="41" cy="100" rx="6" ry="19"/><ellipse class="m quadriceps hip_flexors adductors" cx="59" cy="100" rx="6" ry="19"/>' +
  "</svg>";

export const SVG_BACK =
  '<svg viewBox="0 0 100 178" xmlns="http://www.w3.org/2000/svg">' +
  '<g class="sil">' +
  '<circle cx="50" cy="13" r="8.5"/><rect x="34" y="24" width="32" height="46" rx="8"/>' +
  '<rect x="19" y="28" width="9" height="26" rx="4.5"/><rect x="72" y="28" width="9" height="26" rx="4.5"/>' +
  '<rect x="16" y="52" width="8" height="24" rx="4"/><rect x="76" y="52" width="8" height="24" rx="4"/>' +
  '<rect x="36" y="66" width="28" height="14" rx="5"/>' +
  '<rect x="35" y="78" width="12" height="44" rx="6"/><rect x="53" y="78" width="12" height="44" rx="6"/>' +
  '<rect x="37" y="122" width="9" height="42" rx="4.5"/><rect x="54" y="122" width="9" height="42" rx="4.5"/></g>' +
  '<path class="m traps" d="M39 25 h22 l-4 13 h-14 z"/>' +
  '<circle class="m shoulders_rear shoulders_side" cx="24" cy="33" r="6"/><circle class="m shoulders_rear shoulders_side" cx="76" cy="33" r="6"/>' +
  '<ellipse class="m upper_back" cx="43" cy="43" rx="4" ry="5"/><ellipse class="m upper_back" cx="57" cy="43" rx="4" ry="5"/>' +
  '<ellipse class="m lats" cx="40" cy="56" rx="5" ry="11"/><ellipse class="m lats" cx="60" cy="56" rx="5" ry="11"/>' +
  '<ellipse class="m triceps" cx="22" cy="46" rx="4" ry="8"/><ellipse class="m triceps" cx="78" cy="46" rx="4" ry="8"/>' +
  '<ellipse class="m forearms" cx="19" cy="66" rx="3.6" ry="10"/><ellipse class="m forearms" cx="81" cy="66" rx="3.6" ry="10"/>' +
  '<rect class="m lower_back" x="44" y="63" width="12" height="12" rx="3"/>' +
  '<ellipse class="m glutes abductors" cx="43" cy="86" rx="7" ry="7"/><ellipse class="m glutes abductors" cx="57" cy="86" rx="7" ry="7"/>' +
  '<ellipse class="m hamstrings" cx="41" cy="106" rx="6" ry="16"/><ellipse class="m hamstrings" cx="59" cy="106" rx="6" ry="16"/>' +
  '<ellipse class="m calves" cx="41" cy="148" rx="5" ry="13"/><ellipse class="m calves" cx="59" cy="148" rx="5" ry="13"/>' +
  "</svg>";
