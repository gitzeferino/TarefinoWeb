import React, { useState } from 'react';

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
} from 'react-native';

import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
} from 'firebase/firestore';

import { db } from '../firebaseConfig';

import { useRouter } from 'expo-router';

// ============================================================
// TELA DE CADASTRO
// ============================================================

export default function Cadastro() {

    const router = useRouter();

    // ==========================================================
    // CAMPOS
    // ==========================================================

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    // ==========================================================
    // VISIBILIDADE DAS SENHAS
    // ==========================================================

    const [mostrarSenha, setMostrarSenha] =
        useState(false);

    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] =
        useState(false);

    // ==========================================================
    // MODAIS
    // ==========================================================

    const [modalSucesso, setModalSucesso] =
        useState(false);

    const [modalErro, setModalErro] =
        useState(false);

    const [mensagemErro, setMensagemErro] =
        useState('');

    // ==========================================================
    // CARREGAMENTO
    // ==========================================================

    const [carregando, setCarregando] =
        useState(false);

    // ==========================================================
    // REGRAS DA SENHA
    // ==========================================================

    const tamanhoSenha =
        senha.length >= 8;

    const possuiMaiuscula =
        /[A-Z]/.test(senha);

    const possuiMinuscula =
        /[a-z]/.test(senha);

    const possuiNumero =
        /[0-9]/.test(senha);

    const possuiEspecial =
        /[^A-Za-z0-9]/.test(senha);

    const senhaForte =
        tamanhoSenha &&
        possuiMaiuscula &&
        possuiMinuscula &&
        possuiNumero &&
        possuiEspecial;

    // ==========================================================
    // CONFIRMAÇÃO DA SENHA
    // ==========================================================

    const senhasCoincidem =
        senha.length > 0 &&
        confirmarSenha.length > 0 &&
        senha === confirmarSenha;

    // ==========================================================
    // FORMULÁRIO VÁLIDO
    // ==========================================================

    const formularioValido =
        nome.trim().length > 0 &&
        email.trim().length > 0 &&
        telefone.replace(/\D/g, '').length >= 10 &&
        senhaForte &&
        senhasCoincidem;

    // ==========================================================
    // CADASTRO
    // ==========================================================

    const handleCadastro = async () => {

        const nomeNormalizado =
            nome.trim();

        const emailNormalizado =
            email.toLowerCase().trim();

        const telefoneNormalizado =
            telefone.replace(/\D/g, '');

        // --------------------------------------------------------
        // CAMPOS
        // --------------------------------------------------------

        if (
            !nomeNormalizado ||
            !emailNormalizado ||
            !telefoneNormalizado ||
            !senha ||
            !confirmarSenha
        ) {

            setMensagemErro(
                'Preencha todos os campos.'
            );

            setModalErro(true);

            return;
        }

        // --------------------------------------------------------
        // TELEFONE
        // --------------------------------------------------------

        if (
            telefoneNormalizado.length < 10
        ) {

            setMensagemErro(
                'Informe um telefone válido.'
            );

            setModalErro(true);

            return;
        }

        // --------------------------------------------------------
        // SENHA
        // --------------------------------------------------------

        if (!senhaForte) {

            setMensagemErro(
                'A senha não atende aos requisitos de segurança.'
            );

            setModalErro(true);

            return;
        }

        // --------------------------------------------------------
        // CONFIRMAÇÃO
        // --------------------------------------------------------

        if (senha !== confirmarSenha) {

            setMensagemErro(
                'As senhas não coincidem.'
            );

            setModalErro(true);

            return;
        }

        try {

            setCarregando(true);

            // ------------------------------------------------------
            // VERIFICAR E-MAIL
            // ------------------------------------------------------

            const consultaEmail = query(
                collection(db, 'usuarios'),
                where(
                    'email',
                    '==',
                    emailNormalizado
                )
            );

            // ------------------------------------------------------
            // VERIFICAR TELEFONE
            // ------------------------------------------------------

            const consultaTelefone = query(
                collection(db, 'usuarios'),
                where(
                    'telefone',
                    '==',
                    telefoneNormalizado
                )
            );

            const [
                resultadoEmail,
                resultadoTelefone,
            ] = await Promise.all([
                getDocs(consultaEmail),
                getDocs(consultaTelefone),
            ]);

            // ------------------------------------------------------
            // E-MAIL DUPLICADO
            // ------------------------------------------------------

            if (!resultadoEmail.empty) {

                setMensagemErro(
                    'Este e-mail já está cadastrado.'
                );

                setModalErro(true);

                return;
            }

            // ------------------------------------------------------
            // TELEFONE DUPLICADO
            // ------------------------------------------------------

            if (!resultadoTelefone.empty) {

                setMensagemErro(
                    'Este telefone já está cadastrado.'
                );

                setModalErro(true);

                return;
            }

            // ------------------------------------------------------
            // SALVAR NO FIREBASE
            // ------------------------------------------------------

            await addDoc(
                collection(db, 'usuarios'),
                {
                    nome: nomeNormalizado,

                    email: emailNormalizado,

                    telefone: telefoneNormalizado,

                    senha: senha,

                    criadoEm: new Date(),
                }
            );

            // ------------------------------------------------------
            // SUCESSO
            // ------------------------------------------------------

            setModalSucesso(true);

        } catch (error) {

            console.error(
                'Erro ao realizar cadastro:',
                error
            );

            setMensagemErro(
                'Não foi possível realizar o cadastro. Verifique sua conexão com o Firebase.'
            );

            setModalErro(true);

        } finally {

            setCarregando(false);

        }
    };

    // ==========================================================
    // VOLTAR PARA LOGIN
    // ==========================================================

    const irParaLogin = () => {

        setModalSucesso(false);

        router.replace('/');

    };

    // ==========================================================
    // INTERFACE
    // ==========================================================

    return (

        <SafeAreaView style= { styles.container } >

        <ScrollView
        contentContainerStyle={ styles.scrollContent }
    showsVerticalScrollIndicator = { false}
        >

        <View style={ styles.content }>

        {/* ==================================================
              TÍTULO
          =================================================== */}

            < Text style = { styles.title } >
                Criar conta
                    </Text>

                    < Text style = { styles.subtitle } >
                        Cadastre - se para começar a usar o Tarefino
                            </Text>

    {/* ==================================================
              NOME
          =================================================== */}

    <View style={ styles.inputContainer }>

        <Text style={ styles.label }>
            Nome
            </Text>

            < TextInput
    style = { styles.input }
    placeholder = "Digite seu nome"
    placeholderTextColor = "#999"
    value = { nome }
    onChangeText = { setNome }
        />

        </View>

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
              TELEFONE
          =================================================== */}

    <View style={ styles.inputContainer }>

        <Text style={ styles.label }>
            Telefone
            </Text>

            < TextInput
    style = { styles.input }
    placeholder = "Digite seu telefone"
    placeholderTextColor = "#999"
    value = { telefone }
    onChangeText = { setTelefone }
    keyboardType = "phone-pad"
        />

        </View>

    {/* ==================================================
              SENHA
          =================================================== */}

    <View style={ styles.inputContainer }>

        <Text style={ styles.label }>
            Senha
            </Text>

            < View style = { styles.passwordContainer } >

                <TextInput
                style={ styles.passwordInput }
    placeholder = "Digite sua senha"
    placeholderTextColor = "#999"
    value = { senha }
    onChangeText = { setSenha }
    secureTextEntry = {!mostrarSenha
}
autoCapitalize = "none"
    />

    <TouchableOpacity
                onPress={
    () =>
        setMostrarSenha(
            !mostrarSenha
        )
}
              >

    <Text style={ styles.showPassword }>
    {
        mostrarSenha
        ? 'Ocultar'
            : 'Mostrar'
    }
        </Text>

        </TouchableOpacity>

        </View>

        </View>

{/* ==================================================
              REGRAS
          =================================================== */}

<View style={ styles.rulesContainer }>

    <Text style={ styles.rulesTitle }>
        A senha deve conter:
</Text>

    < Text
style = {
    [
    styles.rule,
    tamanhoSenha &&
    styles.ruleValid,
              ]}
    >
{
    tamanhoSenha
    ? '✓'
        : '○'
}{ ' ' }
              Pelo menos 8 caracteres
    </Text>

    < Text
style = {
    [
    styles.rule,
    possuiMaiuscula &&
    styles.ruleValid,
              ]}
    >
{
    possuiMaiuscula
    ? '✓'
        : '○'
}{ ' ' }
              Uma letra maiúscula
    </Text>

    < Text
style = {
    [
    styles.rule,
    possuiMinuscula &&
    styles.ruleValid,
              ]}
    >
{
    possuiMinuscula
    ? '✓'
        : '○'
}{ ' ' }
              Uma letra minúscula
    </Text>

    < Text
style = {
    [
    styles.rule,
    possuiNumero &&
    styles.ruleValid,
              ]}
    >
{
    possuiNumero
    ? '✓'
        : '○'
}{ ' ' }
              Um número
    </Text>

    < Text
style = {
    [
    styles.rule,
    possuiEspecial &&
    styles.ruleValid,
              ]}
    >
{
    possuiEspecial
    ? '✓'
        : '○'
}{ ' ' }
              Um caractere especial
    </Text>

    </View>

{/* ==================================================
              CONFIRMAR SENHA
          =================================================== */}

<View style={ styles.inputContainer }>

    <Text style={ styles.label }>
        Confirmar senha
            </Text>

            < View style = { styles.passwordContainer } >

                <TextInput
                style={ styles.passwordInput }
placeholder = "Digite novamente sua senha"
placeholderTextColor = "#999"
value = { confirmarSenha }
onChangeText = { setConfirmarSenha }
secureTextEntry = {
                  !mostrarConfirmarSenha
                }
autoCapitalize = "none"
    />

    <TouchableOpacity
                onPress={
    () =>
        setMostrarConfirmarSenha(
            !mostrarConfirmarSenha
        )
}
              >

    <Text style={ styles.showPassword }>
    {
        mostrarConfirmarSenha
        ? 'Ocultar'
            : 'Mostrar'
    }
        </Text>

        </TouchableOpacity>

        </View>

{
    confirmarSenha.length > 0 && (

        <Text
                style={
        [
            styles.passwordMatch,

            senhasCoincidem
                ? styles.passwordMatchValid
                : styles.passwordMatchInvalid,
        ]
    }
              >

    {
        senhasCoincidem
        ? '✓ As senhas coincidem'
            : '✕ As senhas não coincidem'
    }

        </Text>

            )
}

</View>

{/* ==================================================
              BOTÃO
          =================================================== */}

<TouchableOpacity
            style={
    [
        styles.registerButton,

        (!formularioValido ||
            carregando) &&
        styles.buttonDisabled,
    ]
}
onPress = { handleCadastro }
disabled = {
              !formularioValido ||
    carregando
            }
          >

{
    carregando?(

              <ActivityIndicator color = "#FFF" />

            ): (

            <Text style = {styles.registerButtonText} >
    Criar conta
        </Text>

            )}

</TouchableOpacity>

{/* ==================================================
              VOLTAR
          =================================================== */}

<TouchableOpacity
            style={ styles.loginLink }
onPress = {() =>
router.replace('/')
            }
          >

    <Text style={ styles.loginLinkText }>
        Já possui uma conta ? Entrar
            </Text>

            </TouchableOpacity>

            </View>

            </ScrollView>

      {/* ======================================================
          MODAL SUCESSO
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
        Cadastro realizado!
            </Text>

            < Text style = { styles.modalMessage } >
                Sua conta foi criada com sucesso.
              Agora faça login para acessar o Tarefino.
            </Text>

    < TouchableOpacity
style = { styles.modalButton }
onPress = { irParaLogin }
    >

    <Text style={ styles.modalButtonText }>
        Ir para o login
            </Text>

            </TouchableOpacity>

            </View>

            </View>

            </Modal>

{/* ======================================================
          MODAL ERRO
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
                    Atenção
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
        Fechar
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

    scrollContent: {
        flexGrow: 1,
        paddingVertical: 30,
    },

    content: {
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
        paddingHorizontal: 30,
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
        marginBottom: 28,
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

    passwordContainer: {
        height: 52,
        borderWidth: 1,
        borderColor: '#D9DEE7',
        borderRadius: 12,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 14,
    },

    passwordInput: {
        flex: 1,
        fontSize: 16,
        color: '#222',
    },

    showPassword: {
        color: '#208AEF',
        fontWeight: '600',
        fontSize: 13,
    },

    rulesContainer: {
        backgroundColor: '#F0F5FA',
        borderRadius: 12,
        padding: 15,
        marginBottom: 18,
    },

    rulesTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },

    rule: {
        fontSize: 13,
        color: '#777',
        marginBottom: 4,
    },

    ruleValid: {
        color: '#20A050',
    },

    passwordMatch: {
        fontSize: 13,
        marginTop: 6,
    },

    passwordMatchValid: {
        color: '#20A050',
    },

    passwordMatchInvalid: {
        color: '#D93025',
    },

    registerButton: {
        height: 52,
        backgroundColor: '#208AEF',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },

    buttonDisabled: {
        opacity: 0.45,
    },

    registerButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },

    loginLink: {
        alignItems: 'center',
        marginTop: 22,
    },

    loginLinkText: {
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