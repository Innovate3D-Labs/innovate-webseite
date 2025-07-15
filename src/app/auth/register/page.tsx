import { Metadata } from 'next';
import RegistrationForm from '../../../components/auth/RegistrationForm';

export const metadata: Metadata = {
  title: 'Registrierung | Innovate3D Labs',
  description: 'Erstellen Sie Ihr Konto bei Innovate3D Labs für den Zugang zu exklusiven 3D-Druck-Produkten und Services.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Konto erstellen
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Oder{' '}
          <a
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            melden Sie sich an, wenn Sie bereits ein Konto haben
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
}