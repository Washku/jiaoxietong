#ifndef LIB_RICH_IO_H
#define LIB_RICH_IO_H

/// @brief 以字节的形式同时对端口上的8个引脚进行赋值。
/// @param port 待操作的端口号。例如，要操作P0，则传入0。要操作P2，则传入2。
/// @param value 赋予端口的值。
/// 示例
///	要达到等同于P2 = 0xFA的效果，则使用	libRichRegister_Manipulate_Port(2, 0xFA)
///	要达到等同于P3 = 0x2B的效果，则使用	libRichRegister_Manipulate_Port(3, 0x2B)
void libRichIO_Set_Port(unsigned char port, unsigned char value);

/// @brief 以位的形式对引脚进行赋值。
/// @param port 待操作的端口号。例如，要操作P0，则传入0。要操作P2，则传入2。
/// @param pin 待操作的引脚号。例如要操作P00，则传入0。要操作P13，则传入3。
/// @param value 赋予引脚的值。取值0或1。0为低电平，1为高电平。
/// 示例
///	要达到等同于P2 ^ 3 = 1的效果，则使用	libRichRegister_Manipulate_Pin(2, 3, 1)
///	要达到等同于P3 ^ 5 = 0的效果，则使用	libRichRegister_Manipulate_Pin(3, 5, 0)
void libRichIO_Set_Pin(unsigned char port, unsigned char pin, bit value);

#endif