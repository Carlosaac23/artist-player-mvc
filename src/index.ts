import albums from './albums.json';
import { Artist } from './artist';

function main() {
  const theWeeknd = new Artist('The Weeknd', albums);
  theWeeknd.addSongToAlbum('Beauty Behind the Madness', { name: 'Losers', duration: 4.41 });
}

main();
