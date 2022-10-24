import Cookies from 'js-cookie';
export function useUser() {
  return { id: Cookies.get('userId') };
}
