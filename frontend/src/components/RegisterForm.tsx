import { useForm } from 'react-hook-form';
import { useRegisterMutation } from '../api/baseApi';

type RegisterValues = {
    email: string;
    password: string;
};

export function RegisterForm() {
    const { register, handleSubmit } = useForm<RegisterValues>();
    const [registerUser] = useRegisterMutation();

    async function onSubmit(data: RegisterValues) {
        console.log(data.email);
        const result = await registerUser(data);
        if (result.data) {
            alert("Користувача створено");
        } else {
            alert("Не вдалося створити");
        }
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <h2>Registration</h2>
            <input type="email" placeholder="email" required {...register("email")} />
            <input type="password" placeholder="password" required {...register("password")} />
            <button type="submit">Submit</button>
        </form>
    );
}
