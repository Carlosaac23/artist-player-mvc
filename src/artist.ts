import { readFileSync, writeFileSync } from 'fs';

interface Song {
  name: string;
  duration: number; // Minutes
}

interface Album {
  title: string;
  songs: Song[];
}

class Artist {
  private name: string;
  private albums: Album[];

  constructor(name: string, albums: Album[]) {
    this.name = name;
    this.albums = albums;
  }

  getAllAlbums(): void {
    const data = JSON.parse(readFileSync('./src/albums.json', 'utf-8'));
    console.dir(data, { depth: null });
  }

  // Devuelve las canciones de un álbum
  getSongs(albumName: string): void {
    const choosedAlbum = this.albums.find(album => album.title.toLowerCase() === albumName.toLowerCase());
    if (!choosedAlbum) {
      return console.log(`El álbum ${albumName} no existe.`);
    }

    const songs = choosedAlbum.songs;
    console.dir(songs, { depth: null });
  }

  // Devuelve la canción mas larga de un álbum
  getLongestSong(albumName: string): void {
    const choosedAlbum = this.albums.find(album => album.title.toLowerCase() === albumName.toLowerCase());
    if (!choosedAlbum) {
      return console.log(`El álbum ${albumName} no existe.`);
    }

    if (choosedAlbum.songs.length === 0) {
      return console.log('Este álbum no tiene canciones.');
    }

    const longestSong = choosedAlbum.songs.reduce((songOne, songTwo) => (songOne.duration > songTwo.duration ? songOne : songTwo));
    return console.log(`La canción más larga del álbum ${albumName} es: ${longestSong.name}`);
  }

  playRandomSong(albumName: string): void {
    const choosedAlbum = this.albums.find(album => album.title.toLowerCase() === albumName.toLowerCase());
    if (!choosedAlbum) {
      return console.log(`El álbum ${albumName} no existe.`);
    }

    const randomSong = Math.floor(Math.random() * choosedAlbum.songs.length);
    const chooseSong = choosedAlbum.songs[randomSong];
    if (!chooseSong) {
      return console.log('No existe esa canción.');
    }
    console.log(`Reproduciendo ${chooseSong.name} - ${this.name}`);
  }

  // Agrega una canción al álbum seleccionado
  addSongToAlbum(albumName: string, song: Song): void {
    const file = readFileSync('./src/albums.json', 'utf-8');
    const albumsData: Album[] = JSON.parse(file);

    const selectedAlbum = albumsData.find(album => album.title.toLowerCase() === albumName.toLowerCase());
    if (!selectedAlbum) {
      return console.log(`El álbum ${albumName} no existe.`);
    }

    selectedAlbum.songs.push(song);

    writeFileSync('./src/albums.json', JSON.stringify(albumsData, null, 2));
    return console.log('Canción agregada exitosamente!✅');
  }

  createAlbum(newAlbum: Album): void {
    const file = readFileSync('./src/albums.json', 'utf-8');
    const albumsData: Album[] = JSON.parse(file);

    if (!newAlbum.title.trim()) {
      return console.log('El álbum debe tener un título.⚠');
    }

    const albumExists = albumsData.some(album => album.title.toLowerCase() === newAlbum.title.toLowerCase());

    if (albumExists) {
      return console.log('Ese álbum ya existe.');
    }

    albumsData.push(newAlbum);
    writeFileSync('./src/albums.json', JSON.stringify(albumsData, null, 2));
    return console.log('Album agregado exitosamente!✅');
  }

  deleteAlbum(albumName: string): void {
    const file = readFileSync('./src/albums.json', 'utf-8');
    const albumsData: Album[] = JSON.parse(file);

    const albumExists = albumsData.some(album => album.title.toLowerCase() === albumName.toLowerCase());

    if (!albumExists) {
      return console.log(`No se encontró ningún álbum con el nombre: ${albumName}`);
    }

    const updatedAlbums = albumsData.filter(album => album.title.toLowerCase() !== albumName.toLowerCase());
    writeFileSync('./src/albums.json', JSON.stringify(updatedAlbums, null, 2));
    return console.log('Album eliminado correctamente!❌');
  }
}

export { Artist };
