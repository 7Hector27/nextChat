import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import useSWR from 'swr';
import {
  getDatabase,
  ref,
  child,
  push,
  update,
  remove,
  set,
} from 'firebase/database';
import {
  useList,
  useListVals,
  useObjectVal,
  useObject,
} from 'react-firebase-hooks/database';
import app from '../firebase/clientApp';
import MSGComponent from '../components/messageComponent';
import { useAuth } from '../firebase/auth';
import { useRouter, withRouter } from 'next/router';
import styles from './chatroom.module.scss';
export interface MessageProp {
  createdAt?: string;
  id?: string;
  photoURL?: string;
  text?: string;
  name?: string;
}

const Chatroom = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<MessageProp[] | undefined>([]);
  const [msgForm, setMsgForm] = useState<string>('');
  const { user, logout } = useAuth();

  const chat = router.query.chatname as string;
  // const { data, error } = useSWR(
  //   'https://nextchat-73718-default-rtdb.firebaseio.com/messages.json',
  //   (url) => fetch(url).then((res) => res.json())
  // );
  const database = getDatabase(app);
  // console.log(router.query.chatname);
  // const [snapshots, loading, error] = useListVals<MessageProp>(
  //   ref(database, chat)
  // );
  const [value, loading, error] = useObjectVal<any>(ref(database, chat));

  // let arr = Object.keys(value).map((k) => value[k]);
  // console.log(arr);
  const writeNewPost = (e: any) => {
    e.preventDefault();
    if (msgForm === '') {
      return alert('please input something into the input box');
    }
    // Time Stamp
    const d = new Date();
    var hours: number = d.getHours();
    var minutes: number | string = d.getMinutes();
    var ampm: string = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const date: string = hours + ':' + minutes + ' ' + ampm;

    // Get a key for a new Post.
    const newPostKey = push(child(ref(database), chat)).key;

    // A post entry.
    const postData = {
      createdAt: date,
      id: newPostKey,
      photoURL: user?.photoURL,
      text: msgForm,
      name: user?.displayName,
    };

    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates: any = {};
    updates[`/${router.query.chatname}/` + newPostKey] = postData;
    // updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    update(ref(database), updates);
    setMsgForm('');
  };

  const logoutHandler = () => {
    logout();
    router.push('/');
  };

  useEffect(() => {
    if (loading === false) {
      const f = Object?.keys(value).map((k) => value[k]);
      f.pop();
      setMessages(f);
    }
  }, [value, loading]);

  return (
    <>
      <div className={styles.chatroom}>
        <div className={styles.chatroomNav}>
          <div className={styles.chatroomName}>NextChat</div>
          <a onClick={() => logoutHandler()}>Signout</a>
        </div>
        <div className={styles.ChatForm}>
          <div className={styles.chatMessages}>
            {loading ? (
              <h1>...Loading </h1>
            ) : (
              // messages?.map((message: any) => <h3>{message.text}</h3>)
              <MSGComponent {...{ messages }} />
            )}
          </div>
          <div className={styles.chatInputs}>
            <form
              className={styles.chatFormInput}
              onSubmit={(e) => writeNewPost(e)}
            >
              <input
                onChange={(e) => setMsgForm(e.target.value)}
                value={msgForm}
                placeholder='Type a Message'
              ></input>{' '}
              <button onClick={(e) => writeNewPost(e)}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(Chatroom);
