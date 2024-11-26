/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import socketService from '@/repository/socket.repository';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const useGetLastPrice = (ticker?: string) => {
  const [connect, setConnect] = useState(false);
  const [price, setPrice] = useState({
    eur: 0,
    gbp: 0,
    idr: 0,
    jpy: 0,
    myr: 0,
    php: 0,
    sgd: 0,
    thb: 0,
    usd: 0,
    vnd: 0
  });

  useEffect(() => {
    if (ticker !== undefined) {
      socketService.connectAsset();

      socketService.addListener('connect', () => {
        setConnect(true);
      });

      socketService.addListener('joined_asset', (message: any) => {
        toast('Connected to market data');
      });

      socketService.addListener(
        'last_price',
        (message: {
          ticker: string;
          price: {
            eur: number;
            gbp: number;
            idr: number;
            jpy: number;
            myr: number;
            php: number;
            sgd: number;
            thb: number;
            usd: number;
            vnd: number;
          };
        }) => {
          setPrice(message.price);
        }
      );

      return () => {
        socketService.disconnectAsset();
      };
    }
  }, [ticker]);

  useEffect(() => {
    if (connect && ticker !== undefined) {
      socketService.emit('join_asset', { ticker });
    }
  }, [connect, ticker]);

  return price;
};

export default useGetLastPrice;
