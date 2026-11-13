import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../api/baseApi';

type LoginValues = {
    email: string;
    password: string;
};

export function LoginForm() {
    const { register, handleSubmit } = useForm<LoginValues>();
    const [loginUser] = useLoginMutation();

    async function onSubmit(data: LoginValues) {
        const result = await loginUser(data);
        if (result.data) {
            alert("Авторизація успішна");
        } else {
            alert("Не вдалося увійти");
        }
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <h2>Login</h2>
            <input type="email" placeholder="email" required {...register("email")} />
            <input type="password" placeholder="password" required {...register("password")} />
            <button type="submit">Submit</button>
        </form>
    );
}
