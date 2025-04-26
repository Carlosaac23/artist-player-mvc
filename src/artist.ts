import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export interface Song {
  name: string;
  duration: number; // Minutes
}

export interface Album {
  title: string;
  year: number;
  songs: Song[];
}

const filePath = join(__dirname, 'albums.json');

class Artist {
  private name: string;
  private albums: Album[];

  constructor(name: string, albums: Album[]) {
    this.name = name;
    this.albums = albums;
  }

  async getAllAlbums(): Promise<string | null> {
    try {
      const dataString = await readFile(filePath, 'utf-8');
      const data = JSON.parse(dataString);
      console.dir(data, { depth: null });
      return dataString;
    } catch (error) {
      console.error('Oops, algo ha salido mal:', error);
      return null;
    }
  }

  // Devuelve las canciones de un álbum
  getSongs(albumName: string): void {
    const choosedAlbum = this.albums.find(album => album.title.toLowerCase() === albumName.toLowerCase());
    if (!choosedAlbum) {
      return console.error(`El álbum: ${albumName} no existe.`);
    }

    const songs = choosedAlbum.songs;
    console.dir(songs, { depth: null });
  }

  // Devuelve la canción mas larga de un álbum
  getLongestSong(albumName: string): void {
    const choosedAlbum = this.albums.find(album => album.title.toLowerCase() === albumName.toLowerCase());
    if (!choosedAlbum) {
      return console.error(`El álbum: ${albumName} no existe.`);
    }

    if (choosedAlbum.songs.length === 0) {
      return console.error('Este álbum no tiene canciones.');
    }

    const longestSong = choosedAlbum.songs.reduce((songOne, songTwo) => (songOne.duration > songTwo.duration ? songOne : songTwo));
    return console.log(`La canción más larga del álbum ${albumName} es: ${longestSong.name}`);
  }

  playRandomSong(albumName: string): void {
    const choosedAlbum = this.albums.find(album => album.title.toLowerCase() === albumName.toLowerCase());
    if (!choosedAlbum) {
      return console.error(`El álbum: ${albumName} no existe.`);
    }

    const randomSong = Math.floor(Math.random() * choosedAlbum.songs.length);
    const chooseSong = choosedAlbum.songs[randomSong];
    if (!chooseSong) {
      return console.error('No existe esa canción.');
    }
    console.log(`Reproduciendo ${chooseSong.name} - ${this.name}`);
  }

  // Agrega una canción al álbum seleccionado
  async addSongToAlbum(albumName: string, song: Song): Promise<void> {
    try {
      const data = await readFile(filePath, 'utf-8');
      const albumsData: Album[] = JSON.parse(data);

      const selectedAlbum = albumsData.find(album => album.title.toLowerCase() === albumName.toLowerCase());
      if (!selectedAlbum) {
        return console.error(`El álbum: ${albumName} no existe.`);
      }

      if (
        !song ||
        typeof song.name !== 'string' ||
        song.name.trim() === '' ||
        typeof song.duration !== 'number' ||
        isNaN(song.duration) ||
        song.duration <= 0
      ) {
        return console.error('La canción debe tener un nombre y una duración válida!⚠');
      }

      selectedAlbum.songs.push(song);

      await writeFile(filePath, JSON.stringify(albumsData, null, 2));
      return console.log('Canción agregada exitosamente!✅');
    } catch (error) {
      console.error('Oops, algo ha salido mal al intentar guardar la canción❌:', error);
    }
  }

  async createAlbum(newAlbum: Album): Promise<void> {
    try {
      const data = await readFile(filePath, 'utf-8');
      const albumsData: Album[] = JSON.parse(data);

      if (
        !newAlbum ||
        typeof newAlbum.title !== 'string' ||
        newAlbum.title.trim() === '' ||
        typeof newAlbum.year !== 'number' ||
        typeof newAlbum.songs !== 'object'
      ) {
        return console.error('El álbum debe tener al menos un título, un año y un array de canciones.⚠');
      }

      const albumExists = albumsData.some(album => album.title.toLowerCase() === newAlbum.title.toLowerCase());

      if (albumExists) {
        return console.error('Ese álbum ya existe.');
      }

      albumsData.push(newAlbum);

      await writeFile(filePath, JSON.stringify(albumsData, null, 2));
      return console.log('Album agregado exitosamente!✅');
    } catch (error) {
      console.error('Oops, algo ha salido mal al intentar crear el álbum❌:', error);
    }
  }

  // Borra una canción del álbum deseado
  async deleteSong(albumName: string, songName: string): Promise<void> {
    try {
      const file = await readFile(filePath, 'utf-8');
      const albumsData: Album[] = JSON.parse(file);

      const albumIndex = albumsData.findIndex(album => album.title.toLowerCase() === albumName.toLowerCase());
      if (albumIndex === -1) {
        return console.error(`No se encontró ningún álbum con el nombre: ${albumName}`);
      }

      const album = albumsData[albumIndex]!;

      const songIndex = album.songs.findIndex(song => song.name.toLowerCase() === songName.toLowerCase());
      if (songIndex === -1) {
        return console.error(`No se encontró ninguna canción con el nombre: ${songName}`);
      }

      // Elimina la canción
      album.songs.splice(songIndex, 1);

      await writeFile(filePath, JSON.stringify(albumsData, null, 2));
      return console.log('Canción eliminada correctamente!✅');
    } catch (error) {
      console.error('Oops, algo ha salido mal al intentar borrar la canción❌:', error);
    }
  }

  async deleteAlbum(albumName: string): Promise<void> {
    try {
      const file = await readFile(filePath, 'utf-8');
      const albumsData: Album[] = JSON.parse(file);

      const albumIndex = albumsData.findIndex(album => album.title.toLowerCase() === albumName.toLowerCase());

      if (albumIndex === -1) {
        return console.error(`No se encontró ningún álbum con el nombre: ${albumName}`);
      }

      albumsData.splice(albumIndex, 1);

      await writeFile(filePath, JSON.stringify(albumsData, null, 2));
      return console.log('Album eliminado correctamente!✅');
    } catch (error) {
      console.error('Oops, algo ha salido mal al intetar borrar el álbum❌:', error);
    }
  }
}

export { Artist };
