import albums from './albums.json';
import { Artist } from './artist';
import type { Song, Album } from './artist';

function args(): string[] {
  return process.argv.slice(2);
}

function main(): void {
  const argumentos = args();

  if (argumentos.length === 0) {
    return console.dir(albums, { depth: null });
  }

  const artist1 = new Artist('Khalid', albums);

  for (let i = 0; i < argumentos.length; i++) {
    const argument = argumentos[i];
    console.log(argument);
    const firstParameter = argumentos[i + 1];
    console.log(firstParameter);
    const secondParameter = argumentos[i + 2];
    console.log(secondParameter);

    if (argument === '--getAll') {
      artist1.getAllAlbums();
      i++;
    } else if (argument === '--getSongs') {
      const albumName = firstParameter || '';
      artist1.getSongs(albumName);
      i++;
    } else if (argument === '--getLongestSong') {
      const albumName = firstParameter || '';
      artist1.getLongestSong(albumName);
      i++;
    } else if (argument === '--playRandomSong') {
      const albumName = firstParameter || '';
      artist1.playRandomSong(albumName);
      i++;
    } else if (argument === '--addSongToAlbum') {
      const albumName = firstParameter || '';
      try {
        const parsedSong: Song = JSON.parse(secondParameter || '');
        artist1.addSongToAlbum(albumName, parsedSong);
      } catch (error) {
        console.error('El formato de la canción es inválido. Asegúrate de usar un JSON válido.');
      }
      i += 2;
    } else if (argument === '--createAlbum') {
      try {
        const albumName: Album = JSON.parse(firstParameter || '');
        artist1.createAlbum(albumName);
      } catch (error) {
        console.error('El formato del álbum es inválido. Asegúrate de usar un JSON válido.');
      }
      i++;
    } else if (argument === '--deleteSong') {
      const albumName = firstParameter || '';
      const songName = secondParameter || '';
      artist1.deleteSong(albumName, songName);
      i += 2;
    } else if (argument === '--deleteAlbum') {
      const albumName = firstParameter || '';
      artist1.deleteAlbum(albumName);
      i++;
    }
  }
}

main();
