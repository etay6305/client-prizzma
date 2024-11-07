// src/context/UserContext.js
import React, { createContext, useState, PropsWithChildren } from 'react';

// יצירת ה-Context
interface UserContext {
  user: string
  setUser: React.Dispatch<React.SetStateAction<string>>
}
export const UserContext = createContext<UserContext>({
  user: '',
  setUser: () => {}
});

interface Props extends PropsWithChildren {

}

// יצירת ה-Provider
export const UserProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<string>('');

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
