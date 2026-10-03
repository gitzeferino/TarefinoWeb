import React, { useState } from 'react';

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Modal,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';

import {
    collection,
    query,
    where,
    getDocs,
} from 'firebase/firestore';

import { db } from '../firebaseConfig';

import { useRouter } from 'expo-router';

// ============================================================
// TELA DE LOGIN
// ============================================================

export default function Login() {

    const router = useRouter();

    // ==========================================================
    // ESTADOS
    // ==========================================================

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const [modalSucesso, setModalSucesso] = useState(false);
    const [modalErro, setModalErro] = useState(false);

    const [mensagemErro, setMensagemErro] = useState('');

    const [carregando, setCarregando] = useState(false);

    // ==========================================================
    // LOGIN
    // ==========================================================

    const handleLogin = async () => {

        const emailNormalizado = email
            .toLowerCase()
            .trim();

        // --------------------------------------------------------
        // VERIFICAÇÃO DOS CAMPOS
        // --------------------------------------------------------

        if (!emailNormalizado || !senha) {

            setMensagemErro(
                'Informe seu e-mail e sua senha.'
            );

            setModalErro(true);

            return;
        }

        try {

            setCarregando(true);

            // ------------------------------------------------------
            // CONSULTA O USUÁRIO
            // ------------------------------------------------------

            const consulta = query(
                collection(db, 'usuarios'),

                where(
                    'email',
                    '==',
                    emailNormalizado
                ),

                where(
                    'senha',
                    '==',
                    senha
                )
            );

            const resultado = await getDocs(consulta);

            // ------------------------------------------------------
            // LOGIN VÁLIDO
            // ------------------------------------------------------

            if (!resultado.empty) {

                setModalSucesso(true);

                return;
            }

            // ------------------------------------------------------
            // LOGIN INVÁLIDO
            // ------------------------------------------------------

            setMensagemErro(
                'E-mail ou senha inválidos.'
            );

            setModalErro(true);

        } catch (error) {

            console.error(
                'Erro ao realizar login:',
                error
            );

            setMensagemErro(
                'Não foi possível realizar o login. Verifique sua conexão com o Firebase.'
            );

            setModalErro(true);

        } finally {

            setCarregando(false);

        }
    };

    // ==========================================================
    // IR PARA CADASTRO
    // ==========================================================

    const irParaCadastro = () => {

        router.push('/cadastro');

    };

    // ==========================================================
    // IR PARA TAREFAS
    // ==========================================================

    const irParaTarefas = () => {

        setModalSucesso(false);

        router.replace('/tarefas');

    };

    // ==========================================================
    // INTERFACE
    // ==========================================================

    return (

        <SafeAreaView style= { styles.container } >

        <View style={ styles.content }>

        {/* ==================================================
            LOGO
        =================================================== */}

            < Image
    source = { require('../../assets/images/logo-tarefino.png') }
    style = { styles.logo }
    resizeMode = "contain"
        />

    {/* ==================================================
            TÍTULO
        =================================================== */}

        < Text style = { styles.title } >
            Entrar
            </Text>

            < Text style = { styles.subtitle } >
                Acesse sua conta para continuar
                    </Text>

    {/* ==================================================
            E-MAIL
        =================================================== */}

    <View style={ styles.inputContainer }>

        <Text style={ styles.label }>
            E - mail
            </Text>

            < TextInput
    style = { styles.input }
    placeholder = "Digite seu e-mail"
    placeholderTextColor = "#999"
    value = { email }
    onChangeText = { setEmail }
    keyboardType = "email-address"
    autoCapitalize = "none"
    autoCorrect = { false}
        />

        </View>

    {/* ==================================================
            SENHA
        =================================================== */}

    <View style={ styles.inputContainer }>

        <Text style={ styles.label }>
            Senha
            </Text>

            < TextInput
    style = { styles.input }
    placeholder = "Digite sua senha"
    placeholderTextColor = "#999"
    value = { senha }
    onChangeText = { setSenha }
    secureTextEntry
    autoCapitalize = "none"
        />

        </View>

    {/* ==================================================
            BOTÃO ENTRAR
        =================================================== */}

    <TouchableOpacity
          style={
        [
            styles.loginButton,
            carregando && styles.buttonDisabled,
        ]
    }
    onPress = { handleLogin }
    disabled = { carregando }
        >

    {
        carregando?(

            <ActivityIndicator color = "#FFF" />

          ): (

                <Text style = {styles.loginButtonText} >
        Entrar
        </Text>

          )
}

</TouchableOpacity>

{/* ==================================================
            PRIMEIRO ACESSO
        =================================================== */}

<TouchableOpacity
          style={ styles.cadastroButton }
onPress = { irParaCadastro }
    >

    <Text style={ styles.cadastroText }>
        Primeiro acesso
            </Text>

            </TouchableOpacity>

            </View>

{/* ======================================================
          MODAL DE LOGIN BEM-SUCEDIDO
      ======================================================= */}

<Modal
        visible={ modalSucesso }
transparent
animationType = "fade"
onRequestClose = {() =>
setModalSucesso(false)
        }
      >

    <View style={ styles.modalOverlay }>

        <View style={ styles.modal }>

            <Text style={ styles.successIcon }>
              ✓
</Text>

    < Text style = { styles.modalTitle } >
        Login realizado!
            </Text>

            < Text style = { styles.modalMessage } >
                Bem - vindo ao Tarefino.
            </Text>

                    < TouchableOpacity
style = { styles.modalButton }
onPress = { irParaTarefas }
    >

    <Text style={ styles.modalButtonText }>
        Continuar
        </Text>

        </TouchableOpacity>

        </View>

        </View>

        </Modal>

{/* ======================================================
          MODAL DE ERRO
      ======================================================= */}

<Modal
        visible={ modalErro }
transparent
animationType = "fade"
onRequestClose = {() =>
setModalErro(false)
        }
      >

    <View style={ styles.modalOverlay }>

        <View style={ styles.modal }>

            <Text style={ styles.errorIcon }>
                !
                </Text>

                < Text style = { styles.modalTitle } >
                    Não foi possível entrar
                        </Text>

                        < Text style = { styles.modalMessage } >
                        { mensagemErro }
                            </Text>

                            < TouchableOpacity
style = { styles.modalButton }
onPress = {() =>
setModalErro(false)
              }
            >

    <Text style={ styles.modalButtonText }>
        Tentar novamente
            </Text>

            </TouchableOpacity>

            </View>

            </View>

            </Modal>

            </SafeAreaView>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },

    content: {
        flex: 1,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },

    logo: {
        width: 180,
        height: 180,
        alignSelf: 'center',
        marginBottom: 5,
    },

    title: {
        fontSize: 30,
        fontWeight: '700',
        color: '#222',
        textAlign: 'center',
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 15,
        color: '#777',
        textAlign: 'center',
        marginBottom: 30,
    },

    inputContainer: {
        marginBottom: 18,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 7,
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: '#D9DEE7',
        borderRadius: 12,
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#222',
    },

    loginButton: {
        height: 52,
        backgroundColor: '#208AEF',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },

    buttonDisabled: {
        opacity: 0.7,
    },

    loginButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },

    cadastroButton: {
        alignItems: 'center',
        marginTop: 22,
    },

    cadastroText: {
        color: '#208AEF',
        fontSize: 15,
        fontWeight: '600',
    },

    // ==========================================================
    // MODAIS
    // ==========================================================

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
    },

    modal: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 28,
        alignItems: 'center',
    },

    successIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#DFF5E5',
        color: '#20A050',
        fontSize: 36,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 60,
        marginBottom: 15,
    },

    errorIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFE5E5',
        color: '#D93025',
        fontSize: 36,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 60,
        marginBottom: 15,
    },

    modalTitle: {
        fontSize: 21,
        fontWeight: '700',
        color: '#222',
        textAlign: 'center',
        marginBottom: 8,
    },

    modalMessage: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 22,
    },

    modalButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#208AEF',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },

});