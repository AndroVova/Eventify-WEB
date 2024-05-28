import {btnSize, inputSize} from "../../../utils/ui.utils";

import {ButtonBox} from "../../utils/ButtonBox/ButtonBox";
import {Container} from "../../layout/Container/Container";
import InputBox from "../../utils/InputBox/InputBox";
import { Link } from "react-router-dom";
import styles from './user.sign.up.module.css'
import {useTranslation} from "react-i18next";

export const UserSignUp = () => {
    const {t} = useTranslation()

    return (
        <Container width={"700px"}>
            <Link to={'../'} replace={true}>Back</Link>
            <h2>{t('sign_up')}</h2>
            <div className={styles.box}>
                
                <InputBox labelText={t('email')} inputParam={({...inputSize, minLength: 1, required: true})} name={'email'}/>
                <InputBox labelText={t('name')} inputParam={({...inputSize, minLength: 5, required: true})} name={'name'}/>
                <InputBox labelText={t('place_of_residence')} inputParam={({...inputSize, minLength: 3, required: true})} name={'place_of_residence'}/>

                <InputBox labelText={t('birth_date')} type={'date'} inputParam={({...inputSize, required: true})} name={'birth_date'}/>
                <InputBox labelText={t('password')} inputParam={({...inputSize, minLength: 8, required: true})} name={'password'}/>
                <InputBox labelText={t('repeat_password')} inputParam={({...inputSize, minLength: 8, required: true})}  name={'password_two'}/>
            </div>
            <ButtonBox settings={btnSize} text={t('submit')}/>
        </Container>
    )
}