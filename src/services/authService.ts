import { User, AuthState } from '../types';

// Trong một ứng dụng thực tế, đây sẽ là các API call đến backend
// Đối với demo, chúng ta sẽ mô phỏng các API call bằng localStorage

// Lưu trữ người dùng đã đăng ký
const USERS_KEY = 'registered_users';

// Lấy danh sách người dùng đã đăng ký từ localStorage
const getRegisteredUsers = (): User[] => {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

// Lưu danh sách người dùng đã đăng ký vào localStorage
const saveRegisteredUsers = (users: User[]): void => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Kiểm tra xem email đã tồn tại chưa
const isEmailExists = (email: string): boolean => {
    const users = getRegisteredUsers();
    return users.some(user => user.email === email);
};

// Đăng ký người dùng mới
export const register = async (name: string, email: string, password: string): Promise<User> => {
    // Kiểm tra email đã tồn tại chưa
    if (isEmailExists(email)) {
        throw new Error('Email already exists');
    }

    // Tạo người dùng mới
    const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password, // Trong ứng dụng thực tế, mật khẩu sẽ được mã hóa
    };

    // Lưu người dùng mới vào danh sách
    const users = getRegisteredUsers();
    users.push(newUser);
    saveRegisteredUsers(users);

    // Trả về thông tin người dùng (không bao gồm mật khẩu)
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

// Đăng nhập
export const login = async (email: string, password: string): Promise<AuthState> => {
    // Kiểm tra thông tin đăng nhập
    const users = getRegisteredUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Tạo token (trong ứng dụng thực tế, token sẽ được tạo bởi backend)
    const token = `token-${Date.now()}`;

    // Trả về thông tin người dùng và token (không bao gồm mật khẩu)
    const { password: _, ...userWithoutPassword } = user;
    return {
        user: userWithoutPassword,
        token,
    };
};

// Đăng xuất
export const logout = (): void => {
    // In a real application, you might want to call an API to invalidate the token
    // For this demo, we'll just clear the token from localStorage
    localStorage.removeItem('token');
};

// Quên mật khẩu
export const forgotPassword = async (email: string): Promise<void> => {
    // Kiểm tra email có tồn tại không
    if (!isEmailExists(email)) {
        throw new Error('Email not found');
    }

    // Trong ứng dụng thực tế, đây sẽ là nơi gửi email đặt lại mật khẩu
    // Đối với demo, chúng ta sẽ mô phỏng việc gửi email
    console.log(`Password reset email sent to ${email}`);
};

// Đặt lại mật khẩu
export const resetPassword = async (email: string, newPassword: string): Promise<void> => {
    // Kiểm tra email có tồn tại không
    if (!isEmailExists(email)) {
        throw new Error('Email not found');
    }

    // Cập nhật mật khẩu mới
    const users = getRegisteredUsers();
    const updatedUsers = users.map(user => {
        if (user.email === email) {
            return { ...user, password: newPassword };
        }
        return user;
    });
    saveRegisteredUsers(updatedUsers);
}; 