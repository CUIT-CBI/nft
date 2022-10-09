// SPDX-License-Identifier: MIT;

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract Sneaker is ERC1155 {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;

    mapping(uint => string) private _tokenURIs;

    constructor() ERC1155("ipfs://bafybeiglsd5it3st6h3znasju72rz7lndyz7325x2nez6g6jcvetsuvrom/") {}

    function mint(address _recipient,uint _amount, string memory _tokenUrl) public returns(uint _mintTokenId){
        require(bytes(_tokenUrl).length > 0,"The _tokenUrl must be have");
        require(_amount > 0,"The _amount must be have");
        _tokenId.increment();
        uint newTokenId = _tokenId.current();
        _mint(_recipient, newTokenId,_amount,"");
        _tokenURIs[newTokenId] = _tokenUrl;
        return newTokenId;
    }                

    function mintBatch(address _recipient,uint[] memory _amounts,string[] memory _tokenUrls) public returns(uint[] memory _mintTokenIds){
        require(_amounts.length > 0,"The _amounts must be have");
        require(_tokenUrls.length > 0,"The _tokenUrls must be have");
        require(_amounts.length == _tokenUrls.length,"The _tokenUrl length must be Equal _amounts length");

        uint newTokenId;
        uint[] memory returnTokenUrls = new uint[](_amounts.length);

        for(uint256 i = 0; i < _amounts.length; i++){
            _tokenId.increment();
            newTokenId = _tokenId.current();
            _tokenURIs[newTokenId] = _tokenUrls[i];
            returnTokenUrls[i] = newTokenId;
        }

        _mintBatch(_recipient, returnTokenUrls,_amounts,"");

        return returnTokenUrls;
    }

    function uri(uint256 _id) public view override returns(string memory _tokenUrl){
        return _tokenURIs[_id];
        
    }

    function uriBatch(uint[] memory _tokenIds) public view returns(string[] memory _tokenUrls){
        require(_tokenIds.length > 0,"The _tokenId must be have");

        string[] memory returnTokenUrl = new string[](_tokenIds.length);

        for(uint256 i=0;i<_tokenIds.length;i++){
            returnTokenUrl[i] = _tokenURIs[_tokenIds[i]];
        }

        return returnTokenUrl;
    }

}
