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

export interface APISearchResult extends APISearchSuggest {
  limit?: number;
  offset?: number;
}



export interface APIGetMusicUrl {
  id: string | number;
  br?: string | number;
}




export interface APIGetTopSongList extends APIGetSongList {
  cat: string
  offset: number
}


export interface APIGetSongDetail {
  id: string | number;
}