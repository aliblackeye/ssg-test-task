import { FunctionComponent, PropsWithChildren, useState } from 'react';

type Props = {};

export const AppHomeView: FunctionComponent<PropsWithChildren<Props>> = ({
  children,
}) => {
  return (
    <main className="flex-1 bg-white flex items-center justify-center">
      <p className="text-xl text-gray-700">User app!</p>
    </main>
  );
};
