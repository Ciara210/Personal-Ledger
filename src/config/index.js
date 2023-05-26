const MODE = import.meta.env.MODE 

export const baseUrl = MODE == 'development' ? '/api' : 'http://api.chennick.wang'