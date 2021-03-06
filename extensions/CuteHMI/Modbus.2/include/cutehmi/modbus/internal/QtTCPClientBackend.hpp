#ifndef H_EXTENSIONS_CUTEHMI_MODBUS_2_INCLUDE_CUTEHMI_MODBUS_INTERNAL_QTTCPCLIENTBACKEND_HPP
#define H_EXTENSIONS_CUTEHMI_MODBUS_2_INCLUDE_CUTEHMI_MODBUS_INTERNAL_QTTCPCLIENTBACKEND_HPP

#include "QtClientBackend.hpp"
#include "TCPClientConfig.hpp"

#include <QUuid>

namespace cutehmi {
namespace modbus {
namespace internal {

/**
 * Modbus TCP client backend based on Qt Serial Bus.
 */
class CUTEHMI_MODBUS_PRIVATE QtTCPClientBackend:
	public QtClientBackend
{
		Q_OBJECT

	public:
		QtTCPClientBackend(TCPClientConfig * config, QObject * parent = nullptr);

	protected:
		int slaveAddress() const override;

		void configureConnection() override;

	private:
		struct Members
		{
			TCPClientConfig * config;

			Members(TCPClientConfig * p_config):
				config(p_config)
			{
			}
		};

		MPtr<Members> m;
};

}
}
}

#endif

//(c)C: Copyright © 2019, Michał Policht <michal@policht.pl>. All rights reserved.
//(c)C: This file is a part of CuteHMI.
//(c)C: CuteHMI is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//(c)C: CuteHMI is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
//(c)C: You should have received a copy of the GNU Lesser General Public License along with CuteHMI.  If not, see <https://www.gnu.org/licenses/>.
