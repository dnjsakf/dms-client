'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';

import AuthRegisterDialog from '@/components/dialogs/AuthRegisterDialog';

import AuthService from '@/services/common/AuthService';

const LoginPage = () => {

  const router = useRouter();
  const message = useRef(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);

  const callLogin = async () => {
    try {
      const response = await AuthService.login({
        loginId: username,
        loginPwd: password,
      });

      if( response?.code === 200 ){
        router.replace('/');
      } else {
        console.error(response?.message);
        message.current.clear();
        message.current.show({
          id: '1',
          sticky: true,
          severity: 'error',
          // summary: 'Info',
          detail: `Login failed`,
          closable: false
        });
      }
    } catch ( error ){
      console.error(error);
    }
  }

  const handleClickLogin = ( e ) => {
    callLogin();
  }

  const handleClickSignIn = ( e ) => {
    setVisible(true);
  }

  useEffect(() => {
    AuthService.isAuthenticated().then((result)=>{
      if( result ){
        router.replace('/');
      }
    });
  }, [router]);

  return (
    <div className="card">
      <div className="flex flex-column md:flex-row">
        <div className="p-fluid w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
          <div className="flex flex-wrap justify-content-center align-items-center gap-2">
            {/* <label className="w-6rem">Username</label> */}
            <InputText
              id="username"
              name="username"
              className="w-12rem"
              placeholder="Username"
              value={ username }
              onChange={(e)=>setUsername(e.target.value)}
              onKeyDown={(e)=>{
                if( e.code === "Enter" ){
                  handleClickLogin(e);
                }
              }}
            />
          </div>
          <div className="flex flex-wrap justify-content-center align-items-center gap-2">
            <Password
              id="password"
              name="password"
              className="w-12rem"
              placeholder="Password"
              feedback={false} 
              value={ password }
              onChange={(e)=>setPassword(e.target.value)}
              onKeyDown={(e)=>{
                if( e.code === "Enter" ){
                  handleClickLogin(e);
                }
              }}
            />
          </div>
          <Button label="Login" icon="pi pi-user" className="w-10rem mx-auto" onClick={ handleClickLogin }></Button>
        </div>
        <div className="w-full md:w-2">
          <Divider layout="vertical" className="hidden md:flex">
            <b>OR</b>
          </Divider>
          <Divider layout="horizontal" className="flex md:hidden" align="center">
            <b>OR</b>
          </Divider>
        </div>
        <div className="w-full md:w-5 flex align-items-center justify-content-center py-5">
          <Button label="Sign Up" icon="pi pi-user-plus" severity="success" className="w-10rem" onClick={ handleClickSignIn }></Button>
        </div>
      </div>
      {
        visible && (
          <AuthRegisterDialog
            closeDialog={()=>setVisible(false)}
          />
        )
      }
      <Messages ref={ message } />
    </div>
  );
}

export default LoginPage;