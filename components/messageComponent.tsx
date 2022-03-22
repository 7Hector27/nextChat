import React, { ReactNode } from 'react';
import MessageProp from '../pages/chatroom';
import styles from './messageComponent.module.scss';
import { useAuth } from '../firebase/auth';

interface MessageProp {
  messages:
    | {
        createdAt?: string;
        id?: string;
        photoURL?: string;
        text?: string;
        name?: string;
      }[]
    | undefined;
}

const MSGComponent = ({ messages }: MessageProp) => {
  const { user } = useAuth();

  return (
    <div className={styles.MsgComponentContainer}>
      {messages?.map((m) => (
        <div key={m?.id} className={styles.allMsg}>
          <div
            className={
              user?.displayName == m.name
                ? styles.msgComponent
                : styles.msgComponent2
            }
            key={m.id}
          >
            <div className={styles.msgImgDate}>
              <img className={styles.msgImage} src={m.photoURL}></img>
              <p className={styles.msgCreatedAt}>{m.createdAt}</p>
            </div>
            <div className={styles.msgText}>{m.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MSGComponent;
