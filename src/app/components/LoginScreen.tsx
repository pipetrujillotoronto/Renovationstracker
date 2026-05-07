import { useState } from 'react';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-md border-4 border-black">
        <div className="mb-8 text-center">
          <div className="border-2 border-black p-6 mb-6">
            <h1 className="text-2xl">SPIRAL LOGO</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-6">
            <p>Enter your username and password</p>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-black p-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full outline-none"
              />
            </div>

            <div className="border-2 border-black p-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="w-full outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-3 hover:bg-gray-800 transition-colors"
          >
            Sign In
          </button>

          <div className="text-center pt-4">
            <a href="#" className="text-sm underline hover:no-underline">
              Terms and Conditions
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
