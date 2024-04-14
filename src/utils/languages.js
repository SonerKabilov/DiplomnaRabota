const { findFlagUrlByIso2Code } = require('country-flags-svg');

const languages = [
    {
        language: "Arabic",
        cyrillicName: "Арабски",
        flag: findFlagUrlByIso2Code("SA")
    },
    {
        language: "Bengali",
        cyrillicName: "Бенгалски",
        flag: findFlagUrlByIso2Code("BD")
    },
    {
        language: "Chinese (Mandarin)",
        cyrillicName: "Китайски (Мандарин)",
        flag: findFlagUrlByIso2Code("CN")
    },
    {
        language: "English",
        cyrillicName: "Английски",
        flag: findFlagUrlByIso2Code("US")
    },
    {
        language: "French",
        cyrillicName: "Френски",
        flag: findFlagUrlByIso2Code("FR")
    },
    {
        language: "German",
        cyrillicName: "Немски",
        flag: findFlagUrlByIso2Code("DE")
    },
    {
        language: "Hindi",
        cyrillicName: "Хинди",
        flag: findFlagUrlByIso2Code("IN")
    },
    {
        language: "Indonesian",
        cyrillicName: "Индонезийски",
        flag: findFlagUrlByIso2Code("ID")
    },
    {
        language: "Italian",
        cyrillicName: "Италиански",
        flag: findFlagUrlByIso2Code("IT")
    },
    {
        language: "Japanese",
        cyrillicName: "Японски",
        flag: findFlagUrlByIso2Code("JP")
    },
    {
        language: "Korean",
        cyrillicName: "Корейски",
        flag: findFlagUrlByIso2Code("KR")
    },
    {
        language: "Portuguese",
        cyrillicName: "Португалски",
        flag: findFlagUrlByIso2Code("PT")
    },
    {
        language: "Russian",
        cyrillicName: "Руски",
        flag: findFlagUrlByIso2Code("RU")
    },
    {
        language: "Spanish",
        cyrillicName: "Испански",
        flag: findFlagUrlByIso2Code("ES")
    },
    {
        language: "Tamil",
        cyrillicName: "Тамил",
        flag: findFlagUrlByIso2Code("IN")
    },
    {
        language: "Turkish",
        cyrillicName: "Турски",
        flag: findFlagUrlByIso2Code("TR")
    },
    {
        language: "Urdu",
        cyrillicName: "Урду",
        flag: findFlagUrlByIso2Code("PK")
    },
    {
        language: "Vietnamese",
        cyrillicName: "Виетнамски",
        flag: findFlagUrlByIso2Code("VN")
    }
];

module.exports = languages;