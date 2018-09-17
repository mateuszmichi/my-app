import * as React from 'react';

export interface IPictureData {
    imageName: string;
    originalPath: string;
    author: JSX.Element | string;
    source: string;
}
export const minaturePath = "../img/Minatures/"

export const picturesData: IPictureData[] = [
// roshar data
    {
        author: "Unknown",
        imageName: "gems.jpg",
        originalPath: "../img/AboutProject/roshar/",
        source: "http://www.17thshard.com/forum/gallery/image/339-gemstones/",
    },
    {
        author: <a href="https://kelleyharrisart.com/">K.R. Harris</a>,
        imageName: "Highstorm.png",
        originalPath: "../img/AboutProject/roshar/",
        source: "http://stormlightarchive.wikia.com/wiki/File:Stormbless.png",
    },
    {
        author: <a href="http://stormlightarchive.wikia.com/wiki/Isaac_Stewart">Isaac Stewart</a>,
        imageName: "Map_roshar.jpg",
        originalPath: "../img/AboutProject/roshar/",
        source: "http://stormlightarchive.wikia.com/wiki/File:Stormbless.png",
    },
    {
        author: <a href="https://www.artstation.com/dnavenom">Petar Penev DNAVENOM</a>,
        imageName: "parshendi.jpg",
        originalPath: "../img/AboutProject/roshar/",
        source: "https://www.artstation.com/artwork/6yOWW",
    },
    {
        author: <a href="https://www.artstation.com/marianneeie">Marianne Eie</a>,
        imageName: "shardblade.jpg",
        originalPath: "../img/AboutProject/roshar/",
        source: "https://www.artstation.com/marianneeie",
    },
    {
        author: <a href="https://www.deviantart.com/?q=quargon">quargon</a>,
        imageName: "shardplate.jpg",
        originalPath: "../img/AboutProject/roshar/",
        source: "https://www.deviantart.com/quargon/art/Shardplate-Concept-317157912",
    },
    {
        author: <a href="https://idrawgirls.com/tutorials/author/idrawgirls/">Xia Taptara</a>,
        imageName: "shatteredplains.jpg",
        originalPath: "../img/AboutProject/roshar/",
        source: "https://idrawgirls.com/tutorials/2013/05/24/environmental-concept-art-painting-over-photo/",
    },
    {
        author: <a href="https://mortimermironov-art.tumblr.com/">MortimerMironov</a>,
        imageName: "sprens.jpg",
        originalPath: "../img/AboutProject/roshar/",
        source: "https://mortimermironov-art.tumblr.com/post/161494897271/a-skyeel-drawn-in-my-style-tbh-looks-more-like",
    },
    {
        author: <a href="https://www.deviantart.com/chillalord">Chillalord</a>,
        imageName: "stormlight.jpg",
        originalPath: "../img/AboutProject/roshar/",
        source: "https://www.deviantart.com/chillalord/art/Kaladin-Stormblessed-357869437",
    },
    {
        author: <a href="http://stormlightarchive.wikia.com/wiki/Isaac_Stewart">Isaac Stewart</a>,
        imageName: "Surgebinders.jpg",
        originalPath: "../img/AboutProject/roshar/",
        source: "https://vignette.wikia.nocookie.net/stormlightarchive/images/c/c7/Knights_Radiant_and_the_ten_Surges.jpg/revision/latest?cb=20121114044817",
    },
    {
        author: "Unknown",
        imageName: "whoissanderson.jpg",
        originalPath: "../img/AboutProject/roshar/",
        source: "http://i.imgur.com/ogvwLqu.jpg",
    },
    {
        author: <a href="https://www.deviantart.com/elandera13">Elandera13</a>,
        imageName: "windrunners.jpg",
        originalPath: "../img/AboutProject/roshar/",
        source: "https://www.deviantart.com/elandera13/art/Windrunners-Minimalist-Desktop-Wallpaper-741992062",
    },
    {
        author: "Unknown",
        imageName: "sanderson.png",
        originalPath: "../img/AboutProject/",
        source: "https://samequizy.pl/test-wiedzy-archiwum-burzowego-swiatla/",
    },
    {
        author: "Unknown",
        imageName: "webdesign.jpg",
        originalPath: "../img/AboutProject/",
        source: "https://alipartnership.com/category/news/",
    },
    {
        author: "Unknown",
        imageName: "Alethkar.jpg",
        originalPath: "../img/Account/",
        source: "http://it.le-cronache-della-folgoluce.wikia.com/wiki/Alethkar",
    },
    {
        author: <a href="https://coppermind.net/wiki/User:Sheep">Sheep</a>,
        imageName: "ardent.jpg",
        originalPath: "../img/Account/",
        source: "https://coppermind.net/wiki/File:Ardent.jpg",
    },
    {
        author: "Unknown",
        imageName: "JahKeved.jpg",
        originalPath: "../img/Account/",
        source: "http://it.le-cronache-della-folgoluce.wikia.com/wiki/Jah_Keved",
    },
    {
        author: "Unknown",
        imageName: "noble.png",
        originalPath: "../img/Account/",
        source: "https://pl.pinterest.com/pin/428897564488471332/",
    },
    {
        author: <a href="http://stormlightarchive.wikia.com/wiki/Isaac_Stewart">Isaac Stewart</a>,
        imageName: "Skybreakers_glyph.svg",
        originalPath: "../img/CommonGlyphs/",
        source: "https://coppermind.net/wiki/File:Skybreakers_glyph.svg",
    },
    {
        author: <a href="http://stormlightarchive.wikia.com/wiki/Isaac_Stewart">Isaac Stewart</a>,
        imageName: "Dustbringers_glyph.svg",
        originalPath: "../img/CommonGlyphs/",
        source: "https://coppermind.net/wiki/File:Dustbringers_glyph.svg",
    },
    {
        author: <a href="http://stormlightarchive.wikia.com/wiki/Isaac_Stewart">Isaac Stewart</a>,
        imageName: "Edgedancers_glyph.svg",
        originalPath: "../img/CommonGlyphs/",
        source: "https://coppermind.net/wiki/File:Edgedancers_glyph.svg",
    },
    {
        author: <a href="http://stormlightarchive.wikia.com/wiki/Isaac_Stewart">Isaac Stewart</a>,
        imageName: "Truthwatchers_glyph.svg",
        originalPath: "../img/CommonGlyphs/",
        source: "https://coppermind.net/wiki/File:Truthwatchers_glyph.svg",
    },
    {
        author: <a href="http://stormlightarchive.wikia.com/wiki/Isaac_Stewart">Isaac Stewart</a>,
        imageName: "Lightwearers_glyph.svg",
        originalPath: "../img/CommonGlyphs/",
        source: "https://coppermind.net/wiki/File:Shash_glyph.svg",
    },
    {
        author: <a href="http://stormlightarchive.wikia.com/wiki/Isaac_Stewart">Isaac Stewart</a>,
        imageName: "Elsecallers_glyph.svg",
        originalPath: "../img/CommonGlyphs/",
        source: "https://coppermind.net/wiki/File:Beteb_glyph.svg",
    },
    {
        author: <a href="http://stormlightarchive.wikia.com/wiki/Isaac_Stewart">Isaac Stewart</a>,
        imageName: "Willshapers_glyph.svg",
        originalPath: "../img/CommonGlyphs/",
        source: "https://coppermind.net/wiki/File:Willshapers_glyph.svg",
    },
    {
        author: <a href="http://stormlightarchive.wikia.com/wiki/Isaac_Stewart">Isaac Stewart</a>,
        imageName: "Stonewards_glyph.svg",
        originalPath: "../img/CommonGlyphs/",
        source: "https://coppermind.net/wiki/File:Stonewards_glyph.svg",
    },
    {
        author: <a href="http://stormlightarchive.wikia.com/wiki/Isaac_Stewart">Isaac Stewart</a>,
        imageName: "Bondsmiths_glyph.svg",
        originalPath: "../img/CommonGlyphs/",
        source: "https://coppermind.net/wiki/File:Ishi_glyph.svg",
    },
    {
        author: <a href="http://stormlightarchive.wikia.com/wiki/Isaac_Stewart">Isaac Stewart</a>,
        imageName: "Sas.svg",
        originalPath: "../img/CommonGlyphs/",
        source: "https://coppermind.net/wiki/File:Sas.svg",
    },
    {
        author: <a href="http://stormlightarchive.wikia.com/wiki/Isaac_Stewart">Isaac Stewart</a>,
        imageName: "shash.png",
        originalPath: "../img/Login/",
        source: "https://coppermind.net/wiki/File:Shash.svg",
    },
    {
        author: <a href="https://anartaccount.artstation.com/projects/66A1x?album_id=904450">Bram Z</a>,
        imageName: "background.jpg",
        originalPath: "../img/Game/EQ/",
        source: "https://www.artstation.com/artwork/EBneK",
    },
    {
        author: <a href="https://www.artstation.com/otherdistortion">Roman Zawadzki</a>,
        imageName: "travelling-warrior-jay.jpg",
        originalPath: "../img/Game/Locations/Interface/",
        source: "https://www.artstation.com/artwork/vRrgx",
    },
    {
        author: <a href="https://exmakina.tumblr.com/">machinations</a>,
        imageName: "Plains_exm.png",
        originalPath: "../img/MainPage/",
        source: "https://vignette.wikia.nocookie.net/stormlightarchive/images/c/c8/Plains_exm.png/revision/latest?cb=20140807041616",
    },
];
export const IconsAuthors: JSX.Element[] = [
    <div key={0}>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>,
    <div key={1}>Icons made by <a href="https://www.flaticon.com/authors/becris" title="Becris">Becris</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>,
    <div key={2}>Icons made by <a href="https://www.flaticon.com/authors/gregor-cresnar" title="Gregor Cresnar">Gregor Cresnar</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>,
    <div key={3}>Icons made by <a href="https://www.flaticon.com/authors/maxim-basinski" title="Maxim Basinski">Maxim Basinski</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>,
    <div key={4}>Icons made by <a href="https://www.flaticon.com/authors/mynamepong" title="mynamepong">mynamepong</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>,
    <div key={5}>Icons made by <a href="https://www.flaticon.com/authors/nikita-golubev" title="Nikita Golubev">Nikita Golubev</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>,
    <div key={6}>Icons made by <a href="https://www.flaticon.com/authors/prosymbols" title="Prosymbols">Prosymbols</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>,
    <div key={7}>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>,
    <div key={8}>Icons made by <a href="https://www.flaticon.com/authors/srip" title="srip">srip</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>,
    <div key={9}>Icons made by <a href="https://www.flaticon.com/authors/twitter" title="Twitter">Twitter</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>,
    <div key={10}>Icons made by <a href="https://www.flaticon.com/authors/vaadin" title="Vaadin">Vaadin</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>,
    <div key={11}>Icons made by <a href="https://www.flaticon.com/authors/vectors-market" title="Vectors Market">Vectors Market</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>,
];