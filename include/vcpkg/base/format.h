#pragma once

#include <vcpkg/base/fwd/format.h>

#include <vcpkg/base/fmt.h>
#include <vcpkg/base/lineinfo.h>
#include <vcpkg/base/pragmas.h>
#include <vcpkg/base/stringview.h>

template<class Char>
struct fmt::formatter<std::error_code, Char> : formatter<std::string, Char>
{
    template<class FormatContext>
    auto format(const std::error_code& ec, FormatContext& ctx) const -> decltype(ctx.out())
    {
        return formatter<std::string, Char>::format(ec.message(), ctx);
    }
};
