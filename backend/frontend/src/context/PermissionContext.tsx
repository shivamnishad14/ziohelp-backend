import React, { createContext, useState, useContext, useEffect } from 'react'

type Route = {
  selected: boolean
  permissionsName: string
  navigationUrl: string
  actions: string[]
}

type PermissionsContextType = {
  routes: { [key: string]: Route[] }
  setRoutes: React.Dispatch<React.SetStateAction<{ [key: string]: Route[] }>>
  userHasPermission: (url: string) => boolean
  isLoadings: boolean
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
)

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [routes, setRoutes] = useState<{ [key: string]: Route[] }>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [isLoadings] = useState<boolean>(false)

  const userHasPermission = (url: string) => {
    return Object.values(routes).some((category) =>
      category.some((route) => route.navigationUrl === url && route.selected)
    )
  }

  useEffect(() => {
    // For now, set default routes - you can integrate with your API later
    const defaultRoutes = {
      general: [
        { selected: true, permissionsName: 'Dashboard', navigationUrl: '/', actions: ['read'] },
        { selected: true, permissionsName: 'Users', navigationUrl: '/users', actions: ['read', 'write'] },
        { selected: true, permissionsName: 'Roles', navigationUrl: '/roles', actions: ['read', 'write'] },
      ]
    }
    setRoutes(defaultRoutes)
    setLoading(false)
  }, [])

  return (
    <PermissionsContext.Provider
      value={{ routes, setRoutes, userHasPermission, isLoadings }}
    >
      {loading ? (
        <div className='flex min-h-screen items-center justify-center'>
          <div className='h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-violet-500'>
            <span className='sr-only'>Loading...</span>
          </div>
        </div>
      ) : (
        children
      )}
    </PermissionsContext.Provider>
  )
}

export const usePermissions = () => {
  const context = useContext(PermissionsContext)
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider')
  }
  return context
}
