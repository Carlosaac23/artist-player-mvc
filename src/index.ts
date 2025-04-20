import albums from './albums.json';
import { Artist } from './artist';

function main() {
  const theWeeknd = new Artist('The Weeknd', albums);
  theWeeknd.getSongs('starboy');
}

main();
