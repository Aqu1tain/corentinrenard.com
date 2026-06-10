import { SITE_URL } from '#shared/utils/site'

export const useLocalizedUrl = () => {
  const localePath = useLocalePath()

  return (path = '/') => {
    const resolved = localePath(path)
    return `${SITE_URL}${resolved === '/' ? '' : resolved}`
  }
}
