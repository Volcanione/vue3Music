export interface BScrollType {
  refresh(): void;
  destroy(): void;
  on(type: string, fn: (i: any) => void): void;
  finishPullDown(): void;
  finishPullUp(): void;
  scrollToElement(
    el: HTMLElement,
    time: number,
    offsetX: number,
    offsetY: number,
    easing: any
  ): void;
  [propName: string]: any;
}

interface LimitOffset {
  limit?: number;
  offset?: number;
}

export interface APIGetSongList {
  limit: number;
}
export interface APILogin {
  phone?: number;
  email?: number;
  password: string | number;
}

export interface APISearchSuggest {
  keywords: string;
  type?: string | number;
}

export interface ApiGetBanner {
  type?: number;
}

export interface APISearchResult extends APISearchSuggest, LimitOffset {}

export interface APIGetMusicUrl {
  id: string | number;
  br?: string | number;
}

export interface APIGetTopSongList extends APIGetSongList {
  cat: string;
  order?: string;
  offset: number;
}

export interface APIGetSongDetail {
  id: string | number;
}

export interface APIGetSongMusicDetail {
  ids: string;
}

export interface APIGetSongMusicDetail {
  ids: string;
}

export interface APIGetUserPlaylist extends LimitOffset, APIUid {}

export interface APIGetUserRecord {
  uid: number | string;
  type?: number;
}
export interface APIGetTopSong {
  type: number;
}

export interface APIUid {
  uid: number | string;
}

export interface APIGetArtistList extends LimitOffset {
  type?: number;
  area?: number;
  initial?: number | string;
}

export interface APIGetMusicComment extends LimitOffset {
  id: number | string;
  before?: number | string;
  type?: number | string;
}

export interface APISetLikeMusic extends APIGetSongDetail {
  like: boolean;
}
