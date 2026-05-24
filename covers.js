// Генератор тематических обложек кейсов (единый стиль, без текста).
// Тема берётся из c.cover, цвета — из c.c1/c.c2.
(function (global) {
  var ICONS = {
    // Reels / Instagram — телефон с растущим графиком просмотров
    reels:
      '<rect x="122" y="44" width="76" height="112" rx="14"/>' +
      '<line x1="148" y1="56" x2="172" y2="56"/>' +
      '<polyline points="134,140 152,120 168,130 186,96"/>' +
      '<polyline points="174,96 186,96 186,108"/>',
    // Senler / рассылки ВК — диалоги с ростом
    messages:
      '<rect x="96" y="58" width="104" height="62" rx="16"/>' +
      '<rect x="150" y="104" width="72" height="46" rx="14"/>' +
      '<polyline points="116,78 180,78"/>' +
      '<polyline points="116,98 162,98"/>',
    // Маркетплатформа — дешёвые заявки: мишень + монета
    leads:
      '<circle cx="138" cy="106" r="48"/>' +
      '<circle cx="138" cy="106" r="29"/>' +
      '<circle cx="138" cy="106" r="11"/>' +
      '<circle cx="210" cy="62" r="22"/>' +
      '<circle cx="210" cy="62" r="11"/>',
    // VK Реклама / буст WB — корзина и рост продаж
    sales:
      '<path d="M128 92 v58 a8 8 0 0 0 8 8 h52 a8 8 0 0 0 8 -8 v-58"/>' +
      '<path d="M144 92 v-4 a18 18 0 0 1 36 0 v4"/>' +
      '<line x1="214" y1="152" x2="214" y2="120"/>' +
      '<line x1="234" y1="152" x2="234" y2="98"/>',
    // Telegram-бот — голова робота и шестерёнка
    bot:
      '<rect x="118" y="74" width="80" height="66" rx="16"/>' +
      '<line x1="158" y1="74" x2="158" y2="58"/>' +
      '<circle cx="158" cy="54" r="4"/>' +
      '<circle cx="141" cy="104" r="7"/>' +
      '<circle cx="175" cy="104" r="7"/>' +
      '<line x1="145" y1="124" x2="171" y2="124"/>' +
      '<circle cx="214" cy="64" r="14"/>' +
      '<line x1="214" y1="44" x2="214" y2="50"/><line x1="214" y1="78" x2="214" y2="84"/>' +
      '<line x1="194" y1="64" x2="200" y2="64"/><line x1="228" y1="64" x2="234" y2="64"/>',
    // Церебро — трафик: растущий график с узлами
    traffic:
      '<polyline points="100,150 134,118 164,132 198,96 226,70"/>' +
      '<polyline points="212,70 226,70 226,84"/>' +
      '<circle cx="134" cy="118" r="4"/>' +
      '<circle cx="164" cy="132" r="4"/>' +
      '<circle cx="198" cy="96" r="4"/>',
    // ПромоСтраницы — документ и снижение стоимости
    cost:
      '<path d="M98 54 h54 l20 20 v86 a8 8 0 0 1 -8 8 h-66 a8 8 0 0 1 -8 -8 v-98 a8 8 0 0 1 8 -8 z"/>' +
      '<path d="M152 54 v20 h20"/>' +
      '<line x1="108" y1="92" x2="160" y2="92"/>' +
      '<line x1="108" y1="110" x2="160" y2="110"/>' +
      '<line x1="108" y1="128" x2="142" y2="128"/>' +
      '<line x1="220" y1="74" x2="220" y2="128"/>' +
      '<polyline points="208,114 220,130 232,114"/>'
  };

  global.makeCover = function (c) {
    var id = 'cg' + c.id;
    var icon = ICONS[c.cover] || ICONS.traffic;
    return (
      '<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="' + c.c1 + '"/>' +
          '<stop offset="1" stop-color="' + c.c2 + '"/>' +
        '</linearGradient></defs>' +
        '<rect width="320" height="200" fill="url(#' + id + ')"/>' +
        '<rect width="320" height="200" fill="#0d0d0d" opacity="0.14"/>' +
        '<circle cx="262" cy="34" r="92" fill="#fff" opacity="0.07"/>' +
        '<circle cx="44" cy="178" r="70" fill="#fff" opacity="0.05"/>' +
        '<g fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.95">' +
          icon +
        '</g>' +
      '</svg>'
    );
  };
})(window);
