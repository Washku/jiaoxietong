/*******************************************************************************************
  ZH星辰51单片机
  技术支持QQ群：975748331

* 文件: libRich1602.h
* 作者: 朱昊源
* 审核：洪灿墅
* 日期：2024-11-06
* 描述：LCD1602库
* 警告：此文件中的任何修改都将被覆盖。如需修改代码，请新建工程并复制代码，切勿直接在此文件中进行修改！
*******************************************************************************************/

#ifndef __LIBRICH1602_H__
#define __LIBRICH1602_H__

/// @brief 初始化LCD1602，清除DDRAM、光标复位、显示窗口复位。采用0x06、0x0C和0x38进行控制。如需修改，请使用libRich1602_Write(0, x)写入对应指令。
/// @attention 调用本库的其他函数之前必须先调用此函数完成LCD1602的初始化。
void libRich1602_Init();

/// @brief 显示一个字符
/// @param x LCD1602上的列坐标。取值范围[0, 15]。0代表在最左侧显示，15代表在最右侧显示。
/// @param y LCD1602上的行坐标。取值范围[0, 1]。0代表在第一行显示，1代表在第二行显示。
/// @param byte 要显示的字符。可用'Z'的形式传参，也可以直接使用字符的ASCII码所对应的十进制值和十六进制值传参。
/// @attention 对于ASCII码值和LCD1602字模库代码值不同的字符，请直接传入其字模库代码值对应的十进制值或十六进制值。
void libRich1602_Char(unsigned char x, unsigned char y, unsigned char byte);

/// @brief 显示一个字符串。
/// @param x LCD1602上的列坐标。取值范围[0, 15]。0代表在最左侧显示，15代表在最右侧显示。
/// @param y LCD1602上的行坐标。取值范围[0, 1]。0代表在第一行显示，1代表在第二行显示。
/// @param message 要显示的字符串。
/// @attention 字符串中字符必须为ASCII码值和LCD1602字模库代码值相同的字符。若包含ASCII码值和LCD1602字模库代码值不同的字符，请使用libRich1602_Char()逐字符写入。
void libRich1602_String(unsigned char x, unsigned char y, const char *message);

/// @brief 以二进制形式显示一字节数据，高位在前，低位在后。
/// @param x LCD1602上的列坐标。取值范围[0, 15]。0代表在最左侧显示，15代表在最右侧显示。
/// @param y LCD1602上的行坐标。取值范围[0, 1]。0代表在第一行显示，1代表在第二行显示。
/// @param byte 要显示的字节数据。
void libRich1602_Bin(unsigned char x, unsigned char y, unsigned char byte);

/// @brief 以十进制形式显示整型数据。
/// @param x LCD1602上的列坐标。取值范围[0, 15]。0代表在最左侧显示，15代表在最右侧显示。
/// @param y LCD1602上的行坐标。取值范围[0, 1]。0代表在第一行显示，1代表在第二行显示。
/// @param value 要显示的整型数据。
void libRich1602_Dec(unsigned char x, unsigned char y, long value);

/// @brief 以十进制形式显示浮点数据。
/// @param x LCD1602上的列坐标。取值范围[0, 15]。0代表在最左侧显示，15代表在最右侧显示。
/// @param y LCD1602上的行坐标。取值范围[0, 1]。0代表在第一行显示，1代表在第二行显示。
/// @param value 要显示的浮点数据。
/// @param decimalPlace 小数部分位数。
void libRich1602_Float(unsigned char x, unsigned char y, float value, unsigned char decimalPlace);

/// @brief 以十六进制形式显示一字节数据。
/// @param x LCD1602上的列坐标。取值范围[0, 15]。0代表在最左侧显示，15代表在最右侧显示。
/// @param y LCD1602上的行坐标。取值范围[0, 1]。0代表在第一行显示，1代表在第二行显示。
/// @param byte 要以十六进制显示的一字节数据。
void libRich1602_Hex(unsigned char x, unsigned char y, unsigned char byte);

/// @brief 清除LCD1602显示、清除DDRAM、光标复位、显示窗口复位。
void libRich1602_Clear();

/// @brief 向LCD1602写入数据。
/// @param rs 寄存器选择。取值范围[0, 1]。0为写入指令，1为写入显示数据。
/// @param value 实际写入LCD1602的一字节数据。
void libRich1602_Write(unsigned char rs, unsigned char value);

/// @brief 设置DDRAM下次写入显示数据的地址。
/// @param x LCD1602上的列坐标。取值范围[0, 15]。0代表在最左侧显示，15代表在最右侧显示。
/// @param y LCD1602上的行坐标。取值范围[0, 1]。0代表在第一行显示，1代表在第二行显示。
void libRich1602_SetDDRAMAddress(unsigned char x, unsigned char y);

#endif